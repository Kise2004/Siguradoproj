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

import { Responder, sequelize } from "../models/Responder.js";
import { Barangay } from "../models/Barangay.js";
import { Report } from "../models/Report.js";
import { Incident } from "../models/Incident.js";
import { User } from "../models/userModel.js";

await sequelize.sync();

const responderController = {
  // List all responders
  listResponders: async (req, res) => {
    try {
      if (!req.session.userId) return res.redirect("/login");
      
      const user = await User.findByPk(req.session.userId);
      const responders = await Responder.findAll({
        include: [{ model: Barangay, attributes: ['name'] }],
        order: [['lastName', 'ASC']]
      });
      
      // Render view based on user role
      const viewPath = user.role === 'citizen' ? "citizen/responders" : "mdrrmo/responders";
      res.render(viewPath, { title: "Responders", responders });
    } catch (err) {
      console.error(err);
      res.render("mdrrmo/responders", { title: "Responders", responders: [] });
    }
  },

  // Responder dashboard
  responderDashboard: async (req, res) => {
    try {
      if (!req.session.userId) return res.redirect("/login");
      
      const responder = await Responder.findOne({ 
        where: { userId: req.session.userId },
        include: [{ model: Barangay }]
      });
      
      if (!responder) {
        req.flash("error_msg", "Responder profile not found");
        return res.redirect("/dashboard");
      }
      
      // Get assigned incidents
      const assignedReports = await Report.findAll({
        where: { responderId: responder.id },
        include: [{ model: Incident, include: [{ model: Barangay }] }],
        order: [['reportedAt', 'DESC']],
        limit: 10
      });
      
      res.render("responder-dashboard", { 
        title: "Responder Dashboard", 
        responder,
        assignedReports
      });
    } catch (err) {
      console.error(err);
      res.redirect("/dashboard");
    }
  },

  // Submit report for incident
  submitReport: async (req, res) => {
    try {
      if (!req.session.userId) return res.redirect("/login");
      
      const { incidentId, content, actionTaken, resourcesUsed } = req.body;
      
      const responder = await Responder.findOne({ where: { userId: req.session.userId } });
      
      if (!responder) {
        return res.status(403).json({ error: "Not authorized" });
      }
      
      const report = await Report.create({
        incidentId,
        responderId: responder.id,
        content,
        actionTaken,
        resourcesUsed
      });
      
      // Update responder status
      await responder.update({ status: 'on-duty' });
      
      res.json({ success: true, reportId: report.id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to submit report" });
    }
  },

  // Update responder status
  updateStatus: async (req, res) => {
    try {
      if (!req.session.userId) return res.redirect("/login");
      
      const { status } = req.body;
      const responder = await Responder.findOne({ where: { userId: req.session.userId } });
      
      if (!responder) {
        return res.status(403).json({ error: "Not authorized" });
      }
      
      await responder.update({ status });
      
      res.json({ success: true, status });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update status" });
    }
  }
};

export { responderController };