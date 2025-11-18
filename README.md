# 🚨 SIGURADO - Smart Disaster Management System

**Smart Integrated Gloria Unified Response And Disaster Operations**

A comprehensive web-based disaster management platform for the Municipality of Gloria, Oriental Mindoro, built with the XianFire Framework.

---

## 🎯 Project Overview

SIGURADO is a centralized digital hub connecting local government units (LGUs), barangay officials, local responders, and the MDRRMO for quick and efficient emergency operations. The system enables real-time incident reporting, automated alerts, resource management, and data-driven decision-making.

### Key Features

- 📱 **Real-time Incident Reporting** - GPS-enabled reporting with photo uploads
- 🔔 **Instant Alerts** - Socket.IO-powered real-time notifications
- 🗺️ **Hazard Monitoring** - Track floods, typhoons, earthquakes, fires, and landslides
- 👨‍🚒 **Responder Management** - Coordinate emergency response teams
- 📦 **Resource Tracking** - Manage equipment, vehicles, and supplies
- 📊 **Analytics Dashboard** - Data visualization and trend analysis
- 🏘️ **24 Barangays** - Complete coverage of Gloria municipality

---

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| **Framework** | XianFire (Node.js + Express.js) |
| **Frontend** | Tailwind CSS (CDN) |
| **Template Engine** | Handlebars (.xian files) |
| **Database** | MySQL + Sequelize ORM |
| **Real-time** | Socket.IO |
| **Alerts** | SweetAlert2 |
| **File Upload** | Multer |
| **Authentication** | Express-session + bcrypt |

---

## 📋 Prerequisites

- Node.js (v18 or higher)
- MySQL Server (v8.0 or higher)
- npm or yarn package manager

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
cd sigurado
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- express
- sequelize & mysql2
- socket.io
- multer
- bcrypt
- express-session
- connect-flash
- hbs (Handlebars)
- inquirer
- nodemon (dev)

### 3. Configure Database

Edit `models/db.js` if needed:
```javascript
export const sequelize = new Sequelize("sigurado", "root", "", {
  host: "localhost",
  dialect: "mysql"
});
```

### 4. Run Database Migration

This will:
- Create the `sigurado` database
- Create all tables with relationships
- Seed 24 barangays of Gloria

```bash
npm run migrate
```

### 5. Start the Server

**Development mode** (with auto-reload):
```bash
npm run xian
```

**Production mode**:
```bash
npm run xian-start
```

The server will start at: **http://localhost:3000**

---

## 📂 Project Structure

```
sigurado/
├── controllers/          # Business logic
│   ├── authController.js
│   ├── homeController.js
│   ├── incidentController.js
│   ├── responderController.js
│   └── barangayController.js
├── models/              # Database models
│   ├── db.js
│   ├── userModel.js
│   ├── Barangay.js
│   ├── Citizen.js
│   ├── Responder.js
│   ├── Resource.js
│   ├── Incident.js
│   ├── Report.js
│   └── Notification.js
├── routes/              # Route definitions
│   └── index.js
├── views/               # .xian template files
│   ├── landing.xian     # Landing page
│   ├── login.xian
│   ├── register.xian
│   ├── dashboard.xian
│   ├── report-incident.xian
│   ├── incidents.xian
│   ├── barangays.xian
│   ├── responders.xian
│   ├── resources.xian
│   └── partials/
│       ├── head.xian
│       └── footer.xian
├── public/              # Static files
│   ├── tailwind.css
│   └── uploads/
│       └── incidents/   # Incident photos
├── index.js             # Main application file
├── migrate.js           # Database migration
├── create.js            # Model/Controller generator
└── package.json
```

---

## 🎨 User Roles

| Role | Access Level | Capabilities |
|------|-------------|--------------|
| **Citizen** | Basic | Report incidents, view status |
| **Barangay Responder** | Responder | Submit field reports, update status |
| **Barangay Official** | Local Admin | View barangay incidents, manage resources |
| **MDRRMO Staff** | System Admin | Full access, assign responders, analytics |

---

## 🔥 Key Features Explained

### 1. Incident Reporting System
- Citizens can report disasters with GPS location
- Photo evidence upload support
- Real-time severity classification (Low, Medium, High, Critical)
- Automatic notification to MDRRMO and responders

### 2. Real-Time Notifications (Socket.IO)
```javascript
// Emit incident alert
io.to('mdrrmo').emit('new-incident', {
  id: incident.id,
  type: 'flood',
  severity: 'high',
  location: 'Barangay Poblacion'
});
```

### 3. Database Relationships
```
Barangay → Citizen, Responder, Resource, Incident
Citizen → Incident
Incident → Report, Notification
Responder → Report
```

### 4. Event-Driven Architecture
- Automatic alerts on incident reports
- Real-time dashboard updates
- Status change notifications
- Responder assignment tracking

---

## 🌐 Available Routes

### Public Routes
- `GET /` - Landing page
- `GET /login` - Login page
- `POST /login` - Login authentication
- `GET /register` - Registration page
- `POST /register` - User registration

### Protected Routes (Require Login)
- `GET /dashboard` - Main dashboard (role-based redirect)
- `GET /report-incident` - Incident reporting form
- `POST /report-incident` - Submit new incident
- `GET /incidents` - View all incidents
- `GET /incidents/:id` - View incident details
- `POST /incidents/:id/status` - Update incident status
- `GET /barangays` - List all barangays
- `GET /barangays/:id` - Barangay details
- `GET /responders` - List all responders
- `GET /responder-dashboard` - Responder-specific dashboard
- `GET /resources` - Resource management
- `POST /resources` - Add new resource
- `GET /logout` - Logout

---

## 🗄️ Database Schema

### Core Tables
1. **users** - User accounts with roles
2. **barangays** - 24 barangays of Gloria
3. **citizens** - Citizen profiles
4. **responders** - Emergency responders
5. **resources** - Equipment and supplies
6. **incidents** - Disaster reports
7. **reports** - Responder field reports
8. **notifications** - Alert system

---

## 🎯 Covered Disaster Types

- 🌊 **Floods**
- 🌀 **Typhoons**
- 🏚️ **Earthquakes**
- 🔥 **Fires**
- ⛰️ **Landslides**
- 🚗 **Accidents**
- ❓ **Other Emergencies**

---

## 📱 Browser Compatibility

- Chrome (Recommended)
- Firefox
- Safari
- Edge

**Note**: Geolocation features require HTTPS in production or localhost for development.

---

## 🧪 Development Commands

```bash
# Start with auto-reload
npm run xian

# Run migration
npm run migrate

# Generate new model
npm run create:model ModelName

# Generate new controller
npm run create:controller controllerName
```

---

## 📊 Barangays Covered

The system includes all 24 barangays of Gloria, Oriental Mindoro:

1. Agos
2. Agsalin
3. Alma Villa
4. Andres Bonifacio
5. Balete
6. Banilad
7. Banus
8. Bulaklakan
9. Buong Lupa
10. Guimbonan
11. Kawit
12. Macario Adriatico
13. Malamig
14. Malayong
15. Malubay
16. Matulatula
17. Mirayan
18. Narra
19. Paclasan
20. Papandungin
21. Poblacion
22. Santa Maria
23. Santa Theresa
24. Tambong

---

## 🔒 Security Features

- Password hashing with bcrypt
- Session-based authentication
- Role-based access control (RBAC)
- SQL injection protection (Sequelize ORM)
- File upload validation
- CSRF protection ready

---

## 🚀 Deployment

### Production Checklist
1. Set NODE_ENV=production
2. Use HTTPS
3. Configure proper MySQL credentials
4. Set secure session secret
5. Enable CORS if needed
6. Set up proper logging
7. Configure file upload limits

---

## 📝 License

MIT License - Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
Mindoro State University - Philippines

---

## 👥 Contact & Support

**Municipality of Gloria MDRRMO**
- **Address**: Municipal Hall, Gloria, Oriental Mindoro
- **Emergency Hotline**: 911
- **Email**: mdrrmo.gloria@orientalmindoro.gov.ph

---

## 🙏 Acknowledgments

- **Developer**: XianFire Framework Team
- **Institution**: Mindoro State University
- **Target**: Municipality of Gloria, Oriental Mindoro
- **Purpose**: Disaster Preparedness, Response & Recovery

---

**Built with ❤️ for safer communities**

🚨 **SIGURADO** - Because every second counts in disaster response.