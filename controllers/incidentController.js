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
import { User } from "../models/userModel.js";
import { Citizen } from "../models/Citizen.js";
import { Barangay } from "../models/Barangay.js";
import { Notification } from "../models/Notification.js";
import { Chat } from "../models/Chat.js";

await sequelize.sync();

const incidentController = {
  // Display incident report form
  reportPage: async (req, res) => {
    if (!req.session.userId) return res.redirect("/login");
    const user = await User.findByPk(req.session.userId);
    const barangays = await Barangay.findAll();
    
    const error_msg = req.session.error_msg;
    const success_msg = req.session.success_msg;
    delete req.session.error_msg;
    delete req.session.success_msg;
    
    res.render("citizen/report-incident", { title: "Report Incident", barangays, user, error_msg, success_msg });
  },

  // Submit new incident report
  createIncident: async (req, res) => {
    try {
      if (!req.session.userId) return res.redirect("/login");

      const { type, severity, description, location, latitude, longitude, barangayId, casualties, affectedFamilies } = req.body;

      const incident = await Incident.create({
        citizenId: null, // For now, not linking to citizen since users register as User
        barangayId: barangayId || 1,
        type,
        severity: severity || 'medium',
        description,
        location,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        photo: null,
        casualties: casualties ? parseInt(casualties) : 0,
        affectedFamilies: affectedFamilies ? parseInt(affectedFamilies) : 0,
        status: 'reported',
        userId: req.session.userId // Store the user ID directly
      });

      // Create notification
      await Notification.create({
        incidentId: incident.id,
        title: `New ${type} incident reported`,
        message: `${description} - Location: ${location}`,
        type: 'alert',
        targetRole: 'mdrrmo',
        targetBarangay: barangayId || 1
      });

      req.session.success_msg = "Incident reported successfully!";
      res.redirect("/incidents?refresh=" + Date.now());
    } catch (err) {
      console.error("Error creating incident:", err);
      req.session.error_msg = "Failed to report incident. Please try again.";
      res.redirect("/report-incident");
    }
  },  // List all incidents
  listIncidents: async (req, res) => {
    try {
      if (!req.session.userId) return res.redirect("/login");

      const user = await User.findByPk(req.session.userId);

      const incidents = await Incident.findAll({
        include: [
          { model: User, attributes: ['name', 'email'], required: false },
          { model: Barangay, attributes: ['name'] }
        ],
        order: [['reportedAt', 'DESC']]
      });

      // Get flash messages from session
      const error_msg = req.session.error_msg;
      const success_msg = req.session.success_msg;
      delete req.session.error_msg;
      delete req.session.success_msg;

      res.render("citizen/incidents", { title: "Incidents", incidents, user, error_msg, success_msg });
    } catch (err) {
      console.error("Error listing incidents:", err);
      res.render("citizen/incidents", { title: "Incidents", incidents: [], user: null });
    }
  },

  // View single incident details
  viewIncident: async (req, res) => {
    try {
      if (!req.session.userId) return res.redirect("/login");

      const incident = await Incident.findByPk(req.params.id, {
        include: [
          { model: User, attributes: ['name', 'email'], required: false },
          { model: Barangay, attributes: ['name', 'contactPerson', 'contactNumber'] }
        ]
      });

      if (!incident) {
        req.session.error_msg = "Incident not found";
        return res.redirect("/incidents");
      }

      // Get chat messages for this incident
      const messages = await Chat.findAll({
        where: { incidentId: req.params.id },
        order: [['timestamp', 'ASC']]
      });

      res.render("citizen/incident-detail", {
        title: "Incident Details",
        incident,
        messages,
        userId: req.session.userId,
        userRole: req.session.userRole || 'citizen'
      });
    } catch (err) {
      console.error("Error viewing incident:", err);
      res.redirect("/incidents");
    }
  },// Update incident status
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