<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Outfit&weight=700&size=38&duration=3000&pause=1000&color=6366F1&center=true&vCenter=true&width=700&lines=Restaurant+Reservation+System;Smart+Table+Management;Built+with+MERN+Stack" alt="Typing SVG" />

<br/>

<p align="center">
  <b>A production-ready, full-stack restaurant reservation platform with intelligent auto-table matching, role-based access control, and a real-time interactive table floorplan.</b>
</p>

<br/>

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

<br/>

![Tests](https://img.shields.io/badge/Tests-9%20Passing-brightgreen?style=flat-square&logo=checkmarx)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-orange?style=flat-square&logo=github)
![Deploy](https://img.shields.io/badge/Deploy-Render%20%2B%20Vercel-blueviolet?style=flat-square)

<br/><br/>

> **Live Demo:** `https://your-restaurant.vercel.app` &nbsp;|&nbsp; **API Docs:** `https://your-api.onrender.com`

</div>

---

## 📌 Overview

This system solves the critical problem of **double-bookings and manual table management** in restaurants. It provides customers with a seamless, intuitive booking experience while giving administrators complete control over the restaurant's seating operations.

The core engine uses a **smart table-matching algorithm** that automatically finds the smallest available table for any party size — eliminating wasted seats and maximizing table turnover.

---

## ✨ Feature Highlights

<table>
<tr>
<td width="50%" valign="top">

### 👤 Customer Experience
- 🔐 **Secure Auth** — Register, login, JWT-protected sessions
- 🗺️ **Live Table Floorplan** — Visual grid of all tables with real-time status
- 🤖 **Auto Table Matcher** — Smart algorithm assigns the best-fit table
- 🖱️ **Click-to-Book** — Directly click any vacant table to reserve it
- 📋 **My Reservations** — Full booking history with one-click cancel
- 📊 **Personal Dashboard** — Stats cards: Total, Upcoming, Cancelled
- 👤 **Profile Settings** — Update name, email, or password anytime

</td>
<td width="50%" valign="top">

### 🛠️ Admin Control Panel
- 📈 **Analytics Dashboard** — Today's bookings, cancellation rates, capacity usage
- 📋 **All Reservations** — Complete reservation log with date/status/name filters
- ✏️ **Inline Edit** — Modify any booking; system auto-reallocates tables
- ❌ **Cancel Any Booking** — Admin override for any customer reservation
- 🪑 **Table Builder** — Add tables, toggle active/inactive, safely delete
- 🔍 **Search & Filter** — Fuzzy search by customer name, email, or date

</td>
</tr>
</table>

---

## 🧱 Technology Stack

<table>
<tr>
<th>Layer</th>
<th>Technology</th>
<th>Purpose</th>
</tr>
<tr>
<td rowspan="6"><b>Backend</b></td>
<td><img src="https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white&style=flat-square"/> Node.js</td>
<td>JavaScript server runtime</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/-Express.js-000000?logo=express&logoColor=white&style=flat-square"/> Express.js</td>
<td>HTTP routing and middleware framework</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white&style=flat-square"/> MongoDB + Mongoose</td>
<td>Database and ODM schema modeling</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/-JWT-000000?logo=jsonwebtokens&logoColor=white&style=flat-square"/> jsonwebtoken</td>
<td>Authentication token generation</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/-bcryptjs-grey?style=flat-square"/> bcryptjs</td>
<td>Secure password hashing</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/-express--validator-red?style=flat-square"/> express-validator</td>
<td>Request payload validation</td>
</tr>
<tr>
<td rowspan="5"><b>Frontend</b></td>
<td><img src="https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black&style=flat-square"/> React 18</td>
<td>Component-based UI library</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white&style=flat-square"/> Vite</td>
<td>Ultra-fast build toolchain</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/-React_Router-CA4245?logo=react-router&logoColor=white&style=flat-square"/> React Router DOM</td>
<td>Client-side navigation</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/-Axios-5A29E4?logo=axios&logoColor=white&style=flat-square"/> Axios</td>
<td>HTTP client with JWT auto-injection</td>
</tr>
<tr>
<td><img src="https://img.shields.io/badge/-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white&style=flat-square"/> Tailwind CSS</td>
<td>Dark glassmorphism UI design system</td>
</tr>
</table>

---

## 🗂️ Project Architecture

```
📦 Fission tech/
│
├── 📄 .gitignore                       # Root-level: excludes node_modules, .env, dist
├── 📄 README.md
│
├── 🔧 backend/
│   ├── 📄 .env                         # ⚠️  Secret — NOT committed to Git
│   ├── 📄 server.js                    # Entry point: bootstraps Express server
│   ├── 📄 app.js                       # App config: middleware + route mounts
│   │
│   ├── 📁 config/
│   │   └── db.js                       # MongoDB connection logic
│   │
│   ├── 📁 models/                      # Mongoose schemas
│   │   ├── User.js                     # name, email, password, role
│   │   ├── Table.js                    # tableNumber, capacity, isActive
│   │   └── Reservation.js             # userId, tableId, date, timeSlot, status
│   │
│   ├── 📁 controllers/                 # Business logic handlers
│   │   ├── authController.js           # Register · Login · Profile CRUD
│   │   ├── reservationController.js    # Customer booking operations
│   │   ├── adminController.js          # Admin reservation management
│   │   └── tableController.js          # Table CRUD + live availability
│   │
│   ├── 📁 routes/                      # Express route definitions
│   │   ├── authRoutes.js               # /api/auth/*
│   │   ├── reservationRoutes.js        # /api/reservations/*
│   │   ├── adminRoutes.js              # /api/admin/*
│   │   └── tableRoutes.js              # /api/tables/*
│   │
│   ├── 📁 middleware/
│   │   ├── auth.js                     # protect() · authorize() guards
│   │   └── errorHandler.js            # Global error response formatter
│   │
│   ├── 📁 services/
│   │   └── reservationService.js       # ⭐ Core auto-assignment algorithm
│   │
│   ├── 📁 validators/                  # express-validator rule sets
│   ├── 📁 seed/                        # Auto-seeds tables + admin on startup
│   └── 📁 tests/
│       └── runTests.js                 # 9 integration test cases
│
└── 🎨 frontend/
    ├── 📄 index.html
    ├── 📄 vite.config.js
    ├── 📄 tailwind.config.js           # Custom color tokens + fonts
    │
    └── 📁 src/
        ├── main.jsx                    # React root mount
        ├── App.jsx                     # Route map + protected route gates
        │
        ├── 📁 services/
        │   └── api.js                  # Axios instance (base URL + JWT header)
        │
        ├── 📁 context/
        │   └── AuthContext.jsx         # Global user session state (Context API)
        │
        ├── 📁 components/
        │   ├── Navbar.jsx
        │   ├── Spinner.jsx
        │   └── ProtectedRoute.jsx
        │
        └── 📁 pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── customer/
            │   ├── CustomerDashboard.jsx   # Stats + quick-action buttons
            │   ├── ReserveTable.jsx        # Booking form + visual floorplan
            │   ├── MyReservations.jsx      # Reservation list + cancel
            │   └── Profile.jsx
            └── admin/
                ├── AdminDashboard.jsx
                ├── AdminReservations.jsx
                └── AdminTables.jsx
```

---

## 🗄️ Database Schemas

<details>
<summary><b>📘 User Schema</b></summary>

```javascript
{
  name:      String,   // required
  email:     String,   // required · unique
  password:  String,   // bcrypt hashed — never stored as plain text
  role:      String,   // enum: ['customer', 'admin'] · default: 'customer'
  createdAt: Date,
  updatedAt: Date
}
```
</details>

<details>
<summary><b>🪑 Table Schema</b></summary>

```javascript
{
  tableNumber: Number,  // unique identifier e.g. 1, 2, 3 ...
  capacity:    Number,  // max seats: 2, 4, 6, or 8
  isActive:    Boolean, // false = hidden from customers · default: true
  createdAt:   Date,
  updatedAt:   Date
}
```
</details>

<details>
<summary><b>📅 Reservation Schema</b></summary>

```javascript
{
  userId:          ObjectId, // ref → User (required)
  tableId:         ObjectId, // ref → Table (required)
  reservationDate: String,   // 'YYYY-MM-DD' — string prevents timezone drift
  timeSlot:        String,   // e.g. '7:00 PM'
  numberOfGuests:  Number,   // min: 1
  status:          String,   // enum: ['Booked', 'Cancelled'] · default: 'Booked'
  createdAt:       Date,
  updatedAt:       Date
}
```
</details>

---

## 🌐 API Reference

### 🔑 Authentication &nbsp; `/api/auth`

| Method | Endpoint | Access | Description |
|:---:|:---|:---:|:---|
| `POST` | `/register` | Public | Create a new customer account |
| `POST` | `/login` | Public | Authenticate and receive JWT token |
| `GET` | `/profile` | 🔒 Auth | Get logged-in user's profile |
| `PUT` | `/profile` | 🔒 Auth | Update name, email, or password |

### 🍽️ Customer Reservations &nbsp; `/api/reservations`

| Method | Endpoint | Access | Description |
|:---:|:---|:---:|:---|
| `POST` | `/` | 🔒 Customer | Book a table (auto or manual table selection) |
| `GET` | `/my` | 🔒 Customer | Get own reservation history |
| `GET` | `/my/stats` | 🔒 Customer | Dashboard stats: total / upcoming / cancelled |
| `DELETE` | `/:id` | 🔒 Customer | Cancel own reservation |

### 🪑 Tables &nbsp; `/api/tables`

| Method | Endpoint | Access | Description |
|:---:|:---|:---:|:---|
| `GET` | `/` | 🔒 Auth | List all active tables |
| `GET` | `/availability?date=&timeSlot=` | 🔒 Auth | Live status: booked vs vacant per slot |
| `POST` | `/` | 👑 Admin | Create a new table |
| `PUT` | `/:id` | 👑 Admin | Update capacity or active state |
| `DELETE` | `/:id` | 👑 Admin | Delete an inactive table |

### 👑 Admin &nbsp; `/api/admin`

| Method | Endpoint | Access | Description |
|:---:|:---|:---:|:---|
| `GET` | `/reservations` | 👑 Admin | All bookings (filter by date / status / name) |
| `PUT` | `/reservations/:id` | 👑 Admin | Edit any reservation — auto re-assigns table |
| `DELETE` | `/reservations/:id` | 👑 Admin | Cancel any reservation |
| `GET` | `/stats` | 👑 Admin | Restaurant-wide analytics |

---

## ⚙️ Smart Table Assignment Algorithm

When a customer books without selecting a specific table, the backend runs this algorithm:

```
╔══════════════════════════════════════════════════════════╗
║          AUTO TABLE ASSIGNMENT ALGORITHM                 ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  INPUT: date, timeSlot, numberOfGuests                   ║
║                                                          ║
║  1. Fetch all ACTIVE tables where capacity >= guests     ║
║  2. Sort: smallest capacity first → then by tableNumber  ║
║  3. For each candidate table:                            ║
║     └─ Query: any 'Booked' reservation on same          ║
║        date + timeSlot for this tableId?                 ║
║        ├─ NO  → ✅ Assign this table                    ║
║        └─ YES → Skip, try next candidate                 ║
║  4. If all candidates exhausted:                         ║
║     └─ ❌ Return 409: "No tables available"             ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

> **Key Design Decision:** Cancelled reservations are ignored in conflict checks — they free the table for new bookings.

---

## 📐 Reservation Business Rules

```
✅  ALLOWED                          ❌  BLOCKED
────────────────────────────────────────────────────────
Book any vacant table               Same table · same date · same slot
Future dates only                   Dates in the past
Guests ≥ 1                          Guest count = 0
Guests ≤ table capacity             Guest count > table capacity
Cancel any 'Booked' reservation     Cannot cancel 'Cancelled' reservation
Cancelled bookings free the table   N/A
```

### Reservation Lifecycle

```
  ┌──────────┐     Customer books      ┌────────────┐
  │  (none)  │ ──────────────────────► │   Booked   │
  └──────────┘                         └─────┬──────┘
                                             │
                              ┌──────────────┴──────────────┐
                              │                             │
                     Customer cancels               Admin cancels
                              │                             │
                              ▼                             ▼
                        ┌───────────┐               ┌───────────┐
                        │ Cancelled │               │ Cancelled │
                        └───────────┘               └───────────┘
```

### Pre-Seeded Restaurant Tables

| # | Table | Capacity | Ideal For |
|:---:|:---:|:---:|:---|
| 1 | Table 1 | 2 seats | Couples, solo diners |
| 2 | Table 2 | 2 seats | Couples, solo diners |
| 3 | Table 3 | 4 seats | Small families |
| 4 | Table 4 | 4 seats | Small families |
| 5 | Table 5 | 6 seats | Medium groups |
| 6 | Table 6 | 8 seats | Large groups, events |

---

## 🔒 Security Architecture

### JWT Authentication Flow

```
  Client                              Server
    │                                   │
    │  POST /api/auth/login             │
    │  { email, password }              │
    │ ─────────────────────────────►    │
    │                                   │  1. Validate credentials
    │                                   │  2. Hash-compare password (bcrypt)
    │                                   │  3. Sign JWT with secret key
    │                                   │
    │  { token: "eyJhbGci..." }         │
    │ ◄─────────────────────────────    │
    │                                   │
    │  Store token in localStorage      │
    │                                   │
    │  GET /api/reservations/my         │
    │  Authorization: Bearer <token>    │
    │ ─────────────────────────────►    │
    │                                   │  4. Decode + verify JWT
    │                                   │  5. Attach req.user
    │                                   │  6. Check role authorization
    │                                   │
    │  { success: true, data: [...] }   │
    │ ◄─────────────────────────────    │
```

### Role-Based Access Control

```
Route                         Public   Customer   Admin
──────────────────────────────────────────────────────
POST /api/auth/register         ✅        ✅        ✅
POST /api/auth/login            ✅        ✅        ✅
GET  /api/auth/profile          ❌        ✅        ✅
POST /api/reservations          ❌        ✅        ❌
GET  /api/reservations/my       ❌        ✅        ❌
GET  /api/tables                ❌        ✅        ✅
GET  /api/tables/availability   ❌        ✅        ✅
POST /api/tables                ❌        ❌        ✅
GET  /api/admin/reservations    ❌        ❌        ✅
GET  /api/admin/stats           ❌        ❌        ✅
```

---

## 💻 Local Development Setup

### Prerequisites

| Tool | Version | Download |
|:---|:---:|:---|
| Node.js | v18+ | [nodejs.org](https://nodejs.org/) |
| MongoDB | v6+ | [mongodb.com](https://www.mongodb.com/try/download/community) |
| Git | Latest | [git-scm.com](https://git-scm.com/) |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/<your-repo>.git
cd "Fission tech"

# 2. Install backend dependencies
cd backend && npm install

# 3. Install frontend dependencies
cd ../frontend && npm install
```

### Environment Configuration

Create the file `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/restaurant-reservation
JWT_SECRET=your_super_secret_key_change_this_in_production
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> 💡 **Using MongoDB Atlas?** Replace `MONGO_URI` with your Atlas connection string:
> ```env
> MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/restaurant-reservation?retryWrites=true&w=majority
> ```

### Running the Application

Open **two terminal windows** simultaneously:

```bash
# Terminal 1 — Start Backend API (port 5000)
cd backend
npm run dev

# Terminal 2 — Start Frontend Client (port 5173)
cd frontend
npm run dev
```

**Open your browser:** → [http://localhost:5173](http://localhost:5173)

> 🌱 On first launch, the backend **automatically seeds** the database with 6 tables and a default admin account. No manual setup needed.

---

## 🚀 Production Deployment

### Architecture Overview

```
  Users
    │
    ▼
 Vercel CDN ──── React SPA (Static files)
    │                     │
    │            VITE_API_URL (env var)
    │                     │
    ▼                     ▼
 Render ──────── Node.js / Express API (Live Server)
                          │
                    MONGO_URI (env var)
                          │
                          ▼
               MongoDB Atlas (Cloud DB)
```

---

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial production commit"
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

---

### Step 2 — MongoDB Atlas (Database)

1. Sign up → [mongodb.com/atlas](https://www.mongodb.com/products/platform/atlas-database) → Create **Free M0 Cluster**
2. **Network Access** → Add IP → `0.0.0.0/0` (Allow from anywhere)
3. **Database Access** → Add user → set username + password
4. **Connect** → Drivers → Copy connection string:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxx.mongodb.net/restaurant-reservation?retryWrites=true&w=majority
   ```

---

### Step 3 — Backend on Render

1. [render.com](https://render.com) → **New** → **Web Service** → Connect GitHub repo
2. Settings:

   | Setting | Value |
   |:---|:---|
   | Root Directory | `backend` |
   | Build Command | `npm install` |
   | Start Command | `node server.js` |

3. Environment Variables:

   | Key | Value |
   |:---|:---|
   | `PORT` | `10000` |
   | `MONGO_URI` | Your Atlas connection string |
   | `JWT_SECRET` | Any strong random string |
   | `NODE_ENV` | `production` |
   | `CLIENT_URL` | *(fill after Vercel step)* |

4. **Deploy** → Copy your backend URL: `https://your-api.onrender.com`

---

### Step 4 — Frontend on Vercel

1. [vercel.com](https://vercel.com) → **Add New Project** → Import GitHub repo
2. Settings:

   | Setting | Value |
   |:---|:---|
   | Root Directory | `frontend` |
   | Framework Preset | `Vite` |

3. Environment Variables:

   | Key | Value |
   |:---|:---|
   | `VITE_API_URL` | `https://your-api.onrender.com/api` |

4. **Deploy** → Copy your frontend URL: `https://your-restaurant.vercel.app`

---

### Step 5 — Enable CORS (Final Link)

Go back to **Render** → your backend service → **Environment Variables**:

```
CLIENT_URL = https://your-restaurant.vercel.app
```

Save → Render auto-redeploys. **Your app is now fully live! 🎉**

---

## 🔑 Default Credentials

> These are seeded automatically on first server start.

| Role | Email | Password |
|:---:|:---|:---|
| 👑 Admin | `admin@restaurant.com` | `adminpassword123` |

> ⚠️ **Change the admin password immediately after your first production login.**

---

## 🧪 Automated Test Suite

Run the full integration test suite with a single command:

```bash
cd backend
node tests/runTests.js
```

| # | Test Case | Validates |
|:---:|:---|:---|
| 1 | Customer Registration | Account creation and password hashing |
| 2 | Customer Login | Credential validation and JWT issuance |
| 3 | Admin Login | Admin role token issuance |
| 4 | Role Guard | Customers blocked from admin routes (403) |
| 5 | Auto-assign: 2 guests | Correctly assigns Table #1 (capacity 2) |
| 6 | Conflict Detection | Moves to Table #2 when Table #1 is booked |
| 7 | Capacity Matching | 3-guest party gets 4-seat table (not 2-seat) |
| 8 | Full Slot Exhaustion | Returns 409 when all tables are booked |
| 9 | Table Lifecycle | Admin create → deactivate → delete flow |

**Expected output:**
```
✓ Customer registered successfully.
✓ Customer logged in successfully.
✓ Admin logged in successfully.
✓ Correctly returned 403 Forbidden.
✓ Correctly assigned Table #1 (Capacity: 2) for 2 guests.
✓ Correctly assigned Table #2 (Capacity: 2) as Table #1 was booked.
✓ Correctly assigned Table #3 (Capacity: 4) for 3 guests.
✓ Correctly returned 409 Conflict: "No tables available for this time slot."
✓ Successfully deleted inactive Table #10.

======================================
ALL INTEGRATION TESTS PASSED SUCCESSFULLY!
======================================
```

---

## 📋 Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Example | Required | Description |
|:---|:---|:---:|:---|
| `PORT` | `5000` | ✅ | Port the server listens on |
| `MONGO_URI` | `mongodb://localhost:27017/...` | ✅ | MongoDB connection string |
| `JWT_SECRET` | `my_secret_key_123` | ✅ | Signs and verifies JWT tokens |
| `CLIENT_URL` | `http://localhost:5173` | ✅ | Frontend origin for CORS headers |
| `NODE_ENV` | `development` | ✅ | Set to `production` on Render |

### Frontend (Vercel Environment Variables)

| Variable | Example | Required | Description |
|:---|:---|:---:|:---|
| `VITE_API_URL` | `https://your-api.onrender.com/api` | ✅ | Backend API base URL |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ using the MERN Stack**

![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white&style=flat-square)
![Express](https://img.shields.io/badge/-Express.js-000000?logo=express&logoColor=white&style=flat-square)
![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black&style=flat-square)
![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white&style=flat-square)

⭐ **Star this repo if you found it helpful!** ⭐

</div>
