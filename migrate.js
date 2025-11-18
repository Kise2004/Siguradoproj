
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
    
import { Sequelize } from "sequelize";
import { sequelize } from "./models/db.js";
import { User } from "./models/userModel.js";
import { Barangay } from "./models/Barangay.js";
import { Citizen } from "./models/Citizen.js";
import { Responder } from "./models/Responder.js";
import { Resource } from "./models/Resource.js";
import { Incident } from "./models/Incident.js";
import { Report } from "./models/Report.js";
import { Notification } from "./models/Notification.js";
import inquirer from "inquirer";

// Server-level connection (no database selected)
const rootSequelize = new Sequelize("mysql://root:@localhost:3306/");

const { createDb } = await inquirer.prompt([
  {
    type: "confirm",
    name: "createDb",
    message: "Database 'sigurado' may not exist. Create it?",
    default: true,
  },
]);

if (createDb) {
  await rootSequelize.query("CREATE DATABASE IF NOT EXISTS sigurado;");
  console.log("✅ Database created (if it did not exist)");
}

try {
  await sequelize.authenticate();
  console.log("✅ Connected to MySQL database!");
  
  // Define relationships
  Barangay.hasMany(Citizen, { foreignKey: 'barangayId' });
  Citizen.belongsTo(Barangay, { foreignKey: 'barangayId' });
  
  Barangay.hasMany(Responder, { foreignKey: 'barangayId' });
  Responder.belongsTo(Barangay, { foreignKey: 'barangayId' });
  
  Barangay.hasMany(Resource, { foreignKey: 'barangayId' });
  Resource.belongsTo(Barangay, { foreignKey: 'barangayId' });
  
  Barangay.hasMany(Incident, { foreignKey: 'barangayId' });
  Incident.belongsTo(Barangay, { foreignKey: 'barangayId' });
  
  Citizen.hasMany(Incident, { foreignKey: 'citizenId' });
  Incident.belongsTo(Citizen, { foreignKey: 'citizenId' });
  
  Incident.hasMany(Report, { foreignKey: 'incidentId' });
  Report.belongsTo(Incident, { foreignKey: 'incidentId' });
  
  Responder.hasMany(Report, { foreignKey: 'responderId' });
  Report.belongsTo(Responder, { foreignKey: 'responderId' });
  
  Incident.hasMany(Notification, { foreignKey: 'incidentId' });
  Notification.belongsTo(Incident, { foreignKey: 'incidentId' });
  
  User.belongsTo(Barangay, { foreignKey: 'barangayId' });
  Barangay.hasMany(User, { foreignKey: 'barangayId' });
  
  await sequelize.sync({ force: true }); // Drops and recreates tables
  console.log("✅ Tables created for all models!");
  
  // Seed initial barangays for Gloria, Oriental Mindoro
  const barangays = [
    { name: 'Agos', code: 'GLR-AGS', population: 1200, contactPerson: 'Juan Dela Cruz', contactNumber: '09171234567' },
    { name: 'Agsalin', code: 'GLR-AGN', population: 850, contactPerson: 'Maria Santos', contactNumber: '09181234567' },
    { name: 'Alma Villa', code: 'GLR-AVL', population: 1500, contactPerson: 'Pedro Reyes', contactNumber: '09191234567' },
    { name: 'Andres Bonifacio', code: 'GLR-ABF', population: 2100, contactPerson: 'Rosa Garcia', contactNumber: '09201234567' },
    { name: 'Balete', code: 'GLR-BLT', population: 980, contactPerson: 'Jose Ramos', contactNumber: '09211234567' },
    { name: 'Banilad', code: 'GLR-BNL', population: 1350, contactPerson: 'Ana Cruz', contactNumber: '09221234567' },
    { name: 'Banus', code: 'GLR-BNS', population: 1750, contactPerson: 'Carlos Mendoza', contactNumber: '09231234567' },
    { name: 'Bulaklakan', code: 'GLR-BLK', population: 1100, contactPerson: 'Lina Torres', contactNumber: '09241234567' },
    { name: 'Buong Lupa', code: 'GLR-BLP', population: 1450, contactPerson: 'Miguel Fernandez', contactNumber: '09251234567' },
    { name: 'Guimbonan', code: 'GLR-GMB', population: 890, contactPerson: 'Elena Rivera', contactNumber: '09261234567' },
    { name: 'Kawit', code: 'GLR-KWT', population: 1650, contactPerson: 'Ramon Santos', contactNumber: '09271234567' },
    { name: 'Macario Adriatico', code: 'GLR-MAD', population: 2300, contactPerson: 'Sofia Villanueva', contactNumber: '09281234567' },
    { name: 'Malamig', code: 'GLR-MLG', population: 1280, contactPerson: 'Antonio Lopez', contactNumber: '09291234567' },
    { name: 'Malayong', code: 'GLR-MLY', population: 950, contactPerson: 'Carmen Diaz', contactNumber: '09301234567' },
    { name: 'Malubay', code: 'GLR-MLB', population: 1580, contactPerson: 'Francisco Morales', contactNumber: '09311234567' },
    { name: 'Matulatula', code: 'GLR-MTL', population: 1120, contactPerson: 'Josefa Alvarez', contactNumber: '09321234567' },
    { name: 'Mirayan', code: 'GLR-MRY', population: 1390, contactPerson: 'Ricardo Pascual', contactNumber: '09331234567' },
    { name: 'Narra', code: 'GLR-NRA', population: 1820, contactPerson: 'Gloria Santiago', contactNumber: '09341234567' },
    { name: 'Paclasan', code: 'GLR-PCL', population: 1050, contactPerson: 'Domingo Castro', contactNumber: '09351234567' },
    { name: 'Papandungin', code: 'GLR-PPD', population: 1270, contactPerson: 'Teresa Ocampo', contactNumber: '09361234567' },
    { name: 'Poblacion', code: 'GLR-POB', population: 3200, contactPerson: 'Manuel Reyes', contactNumber: '09371234567' },
    { name: 'Santa Maria', code: 'GLR-SMA', population: 1480, contactPerson: 'Cristina Flores', contactNumber: '09381234567' },
    { name: 'Santa Theresa', code: 'GLR-STH', population: 1610, contactPerson: 'Jorge Mendez', contactNumber: '09391234567' },
    { name: 'Tambong', code: 'GLR-TMB', population: 1150, contactPerson: 'Patricia Ruiz', contactNumber: '09401234567' }
  ];
  
  await Barangay.bulkCreate(barangays);
  console.log("✅ Seeded 24 barangays for Gloria, Oriental Mindoro!");
  
} catch (err) {
  console.error("❌ Migration failed:", err);
} finally {
  process.exit();
}

