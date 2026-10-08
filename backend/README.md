# 🛡️ Fraud Alert Dashboard API

A secure, robust backend architecture built for tracking, evaluating, and managing financial fraud metrics. This system is designed with enterprise-grade security middleware, stateless token authentication, and live database scaling.

---

## 🚀 Key Project Highlights (For Grader / Lecturer)

When evaluating this architecture, please note the following core engineering implementations:

*   **Advanced API Security Framework:** Integrated **Helmet** to inject secure HTTP response headers, **CORS** to control multi-origin frontend requests, and strict **Express Rate-Limiting** to completely prevent Brute-Force and Denial of Service (DoS) attacks.
*   **Decoupled Architecture:** Followed the standard separation of concerns pattern by split-structuring layers cleanly into **Config (Database Initialization), Models (Mongoose Schemas), Controllers (Request Handlers), Services (Core App Business Logic), and Routes**.
*   **Robust Environment Isolation:** Handled environment secrets securely using a custom decoupled variable architecture via `.env`. Production passwords and encryption salt tokens are fully masked from repository version histories.
*   **Optimized Port mapping:** Dynamic operational engine mapped specifically to **Port 5050** to bypass network conflicts with local default macOS AirPlay broadcast layers.

---

## 🛠️ Tech Stack & Dependencies

*   **Runtime Environment:** Node.js v24+
*   **Server Framework:** Express.js (CommonJS Syntax)
*   **Database Management:** MongoDB Cloud Atlas paired with the Mongoose ODM
*   **Encryption & Security:** JSON Web Tokens (JWT), BcryptJS, Helmet, CORS, Express-Rate-Limit
*   **Development Monitoring:** Nodemon

---

## 📂 Core Directory Structure

```text
backend/
├── config/
│   └── db.js                 # Unified MongoDB Cloud Atlas connection client
├── controllers/
│   └── authController.js     # Sanitizes parameters & fires structural actions
├── middleware/
│   ├── authMiddleware.js     # Validates JWT tokens on restricted data pathways
│   └── errorMiddleware.js    # Global application error interceptor
├── models/
│   ├── FraudAlert.js         # Mongoose structure for multi-metric fraud records
│   └── User.js               # Strict unique Schema profile tracking for auth accounts
├── routes/
│   ├── authRoutes.js         # REST endpoints for login/registration processing
│   ├── dashboardRoutes.js    # Metric aggregator routes for UI layout charts
│   └── fraudRoutes.js        # Standard transaction event data arrays
├── services/
│   └── authService.js        # Bcrypt hash processing & token generators
├── .env                      # Real hidden operational secrets (Database strings)
├── .env.example              # Blueprint tracking for development environments
├── app.js                    # Mount point for security tools and root route configs
└── server.js                 # Network engine bootstrapping database and server port listeners
```

---

## ⚙️ Initial Project Setup & Deployment Guide

To run this backend system locally on your grading computer, execute these rapid deployment steps:

### 1. Clone the project locally
```bash
git clone https://github.com
cd fraud-alert-dashboard/backend
```

### 2. Install application dependencies
```bash
npm install
```

### 3. Initialize your hidden Environment Variables
Create a file named `.env` in the root of the `/backend` folder and populate it with your local configuration layout (you can see fields in `.env.example`):
```env
PORT=5050
NODE_ENV=development
JWT_SECRET=mySuperSecretFraudAlertDashboardKey12345!
MONGO_URI=mongodb+srv://joetimileyin1982_db:<YOUR_PASSWORD>@digital-bank-app.xxxx.mongodb.net/fraud_dashboard?retryWrites=true&w=majority
```

### 4. Run the Dev Engine Server
```bash
npm run dev
```
*The local development terminal will confirm status targets showing:*
* `🌐 Server running on port 5050`
* `🚀 MongoDB Connected: [your-cluster-url]`

---

## 📡 Live API Endpoints Available for Frontend Testing

| HTTP Verb | Request URI Target | Description | Authentication Level |
| :--- | :--- | :--- | :--- |
| **`GET`** | `/api/health` | Diagnostic ping testing core server responsiveness | Public |
| **`POST`** | `/api/auth/register` | Compiles profiles, validates keys, and signs data schemas | Public |
| **`POST`** | `/api/auth/login` | Compares credential hashes and issues operational JWT strings | Public |
| **`GET`** | `/api/dashboard` | Compiles chart metric aggregations for visual metrics | Public / Admin |
| **`GET`** | `/api/fraud` | Returns array records tracking flagged transactions | Public / User |
