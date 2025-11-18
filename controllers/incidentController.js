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

import { Incident, sequelize } from "../models/Incident.js";
import { Citizen } from "../models/Citizen.js";
import { Barangay } from "../models/Barangay.js";
import { Notification } from "../models/Notification.js";

await sequelize.sync();

const incidentController = {
  // Display incident report form
  reportPage: async (req, res) => {
    if (!req.session.userId) return res.redirect("/login");
    const barangays = await Barangay.findAll();
    res.render("citizen/report-incident", { title: "Report Incident", barangays });
  },

  // Submit new incident report
  createIncident: async (req, res) => {
    try {
      if (!req.session.userId) return res.redirect("/login");
      
      const { type, severity, description, location, latitude, longitude, barangayId, casualties, affectedFamilies } = req.body;
      
      // Get citizen info
      const citizen = await Citizen.findOne({ where: { userId: req.session.userId } });
      
      const incident = await Incident.create({
        citizenId: citizen ? citizen.id : null,
        barangayId: barangayId || 1,
        type,
        severity: severity || 'medium',
        description,
        location,
        latitude: latitude || null,
        longitude: longitude || null,
        photo: null,
        casualties: casualties || 0,
        affectedFamilies: affectedFamilies || 0,
        status: 'reported'
      });
      
      // Create notification
      await Notification.create({
        incidentId: incident.id,
        title: `New ${type} incident reported`,
        message: `${description} - Location: ${location}`,
        type: 'alert',
        targetRole: 'mdrrmo',
        targetBarangay: barangayId
      });
      
      req.flash("success_msg", "Incident reported successfully!");
      res.redirect("/incidents");
    } catch (err) {
      console.error(err);
      req.flash("error_msg", "Failed to report incident");
      res.redirect("/report-incident");
    }
  },

  // List all incidents
  listIncidents: async (req, res) => {
    try {
      if (!req.session.userId) return res.redirect("/login");
      
      const incidents = await Incident.findAll({
        include: [
          { model: Citizen, attributes: ['firstName', 'lastName'] },
          { model: Barangay, attributes: ['name'] }
        ],
        order: [['reportedAt', 'DESC']]
      });
      
      res.render("citizen/incidents", { title: "Incidents", incidents });
    } catch (err) {
      console.error(err);
      res.render("citizen/incidents", { title: "Incidents", incidents: [] });
    }
  },

  // View single incident details
  viewIncident: async (req, res) => {
    try {
      if (!req.session.userId) return res.redirect("/login");
      
      const incident = await Incident.findByPk(req.params.id, {
        include: [
          { model: Citizen, attributes: ['firstName', 'lastName', 'contactNumber'] },
          { model: Barangay, attributes: ['name', 'contactPerson', 'contactNumber'] }
        ]
      });
      
      if (!incident) {
        req.flash("error_msg", "Incident not found");
        return res.redirect("/incidents");
      }
      
      res.render("incident-detail", { title: "Incident Details", incident });
    } catch (err) {
      console.error(err);
      res.redirect("/incidents");
    }
  },

  // Update incident status
  updateStatus: async (req, res) => {
    try {
      if (!req.session.userId) return res.redirect("/login");
      
      const { status } = req.body;
      const incident = await Incident.findByPk(req.params.id);
      
      if (!incident) {
        return res.status(404).json({ error: "Incident not found" });
      }
      
      await incident.update({ status });
      
      res.json({ success: true, status });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update status" });
    }
  }
};

export { incidentController };