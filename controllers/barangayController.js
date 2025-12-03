/*
    MIT License
    
    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
    Mindoro State University - Philippines

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    */

import { Barangay, sequelize } from "../models/Barangay.js";
import { Resource } from "../models/Resource.js";
import { Incident } from "../models/Incident.js";
import { Citizen } from "../models/Citizen.js";
import { Responder } from "../models/Responder.js";
import { User } from "../models/userModel.js";

await sequelize.sync();

const barangayController = {
  // List all barangays
  listBarangays: async (req, res) => {
    try {
      if (!req.session.userId) return res.redirect("/login");
      
      const user = await User.findByPk(req.session.userId);
      const barangays = await Barangay.findAll({
        order: [['name', 'ASC']]
      });
      
      // Render view based on user role
      const viewPath = user.role === 'citizen' ? "citizen/barangays" : "mdrrmo/barangays";
      res.render(viewPath, { title: "Barangays", barangays });
    } catch (err) {
      console.error(err);
      res.render("mdrrmo/barangays", { title: "Barangays", barangays: [] });
    }
  },

  // View barangay details
  viewBarangay: async (req, res) => {
    try {
      if (!req.session.userId) return res.redirect("/login");
      
      const barangay = await Barangay.findByPk(req.params.id);
      
      if (!barangay) {
        req.session.error_msg = "Barangay not found";
        return res.redirect("/barangays");
      }
      
      // Get statistics
      const resources = await Resource.findAll({ where: { barangayId: barangay.id } });
      const incidents = await Incident.findAll({ 
        where: { barangayId: barangay.id },
        order: [['reportedAt', 'DESC']],
        limit: 5
      });
      const citizens = await Citizen.count({ where: { barangayId: barangay.id } });
      const responders = await Responder.findAll({ where: { barangayId: barangay.id } });
      
      res.render("official/barangay-detail", { 
        title: barangay.name,
        barangay,
        resources,
        incidents,
        citizenCount: citizens,
        responders
      });
    } catch (err) {
      console.error(err);
      res.redirect("/barangays");
    }
  },

  // List resources for a barangay
  listResources: async (req, res) => {
    try {
      if (!req.session.userId) return res.redirect("/login");
      
      const user = await User.findByPk(req.session.userId);
      const resources = await Resource.findAll({
        include: [{ model: Barangay, attributes: ['name'] }],
        order: [['name', 'ASC']]
      });
      
      const barangays = await Barangay.findAll({ order: [['name', 'ASC']] });

      // Render view based on user role
      const viewPath = user.role === 'citizen' ? "citizen/resources" : "mdrrmo/resources";
      const error_msg = req.session.error_msg;
      const success_msg = req.session.success_msg;
      delete req.session.error_msg;
      delete req.session.success_msg;
      res.render(viewPath, { title: "Resources", resources, barangays, user, error_msg, success_msg });
    } catch (err) {
      console.error(err);
      res.render("mdrrmo/resources", { title: "Resources", resources: [] });
    }
  },

  // Add new resource
  addResource: async (req, res) => {
    try {
      if (!req.session.userId) return res.redirect("/login");
      
      const { barangayId, name, type, quantity, unit, condition, description } = req.body;
      
      await Resource.create({
        barangayId,
        name,
        type,
        quantity: quantity || 1,
        unit: unit || 'unit',
        condition: condition || 'good',
        status: 'available',
        description
      });

      req.session.success_msg = "Resource added successfully!";
      res.redirect("/resources");
    } catch (err) {
      console.error(err);
      req.session.error_msg = "Failed to add resource";
      res.redirect("/resources");
    }
  }
};

export { barangayController };