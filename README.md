# 📋 Job Application Tracker

A full-stack MERN-style Job Application Tracker dashboard to manage your entire hiring pipeline — from first application through offer negotiation.

## ✨ Features

- **Status Workflows** — Move applications through Applied → Interview → Offer → Rejected
- **Kanban Board** — Drag-and-drop cards between stage columns
- **Table View** — Sortable, filterable list view
- **Stats Dashboard** — Interview rate, offer rate, average salary, upcoming interviews
- **Full CRUD** — Create, edit, delete applications
- **Filtering & Sorting** — Filter by stage, search by company/role/notes, sort by date/salary/company
- **Interview Scheduling** — Log multiple interview rounds with date, type, and notes
- **JWT Authentication** — Secure registration, login, and demo account
- **JSON Data Store** — No database needed — data persists in `server/data/` JSON files

---

## 🛠️ Tech Stack

| Layer     | Technology                     |
|-----------|-------------------------------|
| Frontend  | React 18, Vite, Lucide Icons  |
| Backend   | Node.js, Express 4            |
| Auth      | JWT (jsonwebtoken + bcryptjs) |
| Storage   | JSON flat-file (no MongoDB)   |
| Dev Tools | Nodemon, Concurrently         |

---

## 📁 Project Structure

```
job-application-tracker/
├── client/                       # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── AuthPage.jsx
│   │   │   ├── StatsCards.jsx
│   │   │   ├── UpcomingInterviewsCard.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── KanbanBoard.jsx          # Drag & drop
│   │   │   ├── ApplicationTable.jsx
│   │   │   ├── ApplicationModal.jsx
│   │   │   ├── DeleteConfirmModal.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── context/AuthContext.jsx       # Auth state + JWT
│   │   ├── pages/DashboardPage.jsx
│   │   ├── services/api.js               # REST API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                       # Express REST API
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── applicationController.js
│   │   ├── middleware/auth.js            # JWT middleware
│   │   ├── models/database.js           # JSON file DB
│   │   └── routes/
│   │       ├── authRoutes.js
│   │       └── applicationRoutes.js
│   ├── data/                            # Auto-created JSON files
│   │   ├── users.json
│   │   └── applications.json
│   ├── server.js
│   ├── .env
│   └── package.json
│
├── package.json                  # Root (concurrently dev script)
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/dharanisindhu161/job-application-tracker.git
cd job-application-tracker
npm run install:all
```

### 2. Configure Environment

The server `.env` is already included for local dev. To customize:

```bash
# server/.env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
```

### 3. Run in Development

```bash
# Run both server + client simultaneously
npm run dev
```

- **Frontend:** http://localhost:5173  
- **Backend API:** http://localhost:5000  
- **API Health:** http://localhost:5000/api/health

### 4. Demo Login

Use the **"Try Demo Account"** button on the login page — 6 pre-seeded applications are ready to explore.

| Email | Password |
|-------|----------|
| `demo@jobtracker.com` | `demo1234` |

---

## 🔌 REST API Reference

All `/api/applications` routes require `Authorization: Bearer <token>` header.

| Method   | Endpoint                              | Description                              |
|----------|---------------------------------------|------------------------------------------|
| `POST`   | `/api/auth/register`                  | Register a new user account              |
| `POST`   | `/api/auth/login`                     | Login and receive JWT token              |
| `POST`   | `/api/auth/demo`                      | Login as demo user                       |
| `GET`    | `/api/auth/me`                        | Get current authenticated user          |
| `GET`    | `/api/applications`                   | Get all applications (filter + sort)     |
| `POST`   | `/api/applications`                   | Create a new job application             |
| `GET`    | `/api/applications/stats`             | Aggregated dashboard statistics          |
| `GET`    | `/api/applications/:id`               | Get single application by ID             |
| `PUT`    | `/api/applications/:id`               | Full update of an application            |
| `PATCH`  | `/api/applications/:id/status`        | Update status/stage only                 |
| `DELETE` | `/api/applications/:id`               | Delete an application                    |

### Query Parameters for `GET /api/applications`

| Param       | Values                                              |
|-------------|-----------------------------------------------------|
| `status`    | `Applied` / `Interview` / `Offer` / `Rejected`     |
| `search`    | Searches company, role, and notes                   |
| `sortBy`    | `applicationDate`, `company`, `salaryExpectation`   |
| `sortOrder` | `asc` / `desc`                                     |

### Application JSON Schema

```json
{
  "id": "app-uuid",
  "userId": "usr-uuid",
  "company": "Stripe",
  "role": "Senior Full Stack Engineer",
  "jobLink": "https://stripe.com/jobs/...",
  "salaryExpectation": 165000,
  "applicationDate": "2026-10-10",
  "status": "Interview",
  "interviewDates": [
    {
      "id": "int-1",
      "date": "2026-10-25T14:30:00.000Z",
      "round": "System Design Interview",
      "notes": "Prepare payment pipeline and cache invalidation",
      "completed": false
    }
  ],
  "notes": "Referral from Alex on the API team",
  "createdAt": "2026-10-10T09:00:00.000Z",
  "updatedAt": "2026-10-18T11:00:00.000Z"
}
```

---

## 📊 Dashboard Stats API Response

`GET /api/applications/stats` returns:

```json
{
  "total": 6,
  "stages": { "Applied": 2, "Interview": 2, "Offer": 1, "Rejected": 1 },
  "metrics": {
    "interviewRate": 50,
    "offerRate": 17,
    "averageSalary": 165500,
    "minSalary": 155000,
    "maxSalary": 175000,
    "salaryCount": 6
  },
  "upcomingInterviews": [ ... ],
  "recentApplications": [ ... ]
}
```

---

## 📦 Build for Production

```bash
# Build the React frontend
npm run client:build

# Start the Express server (serves built frontend + API)
npm start
```

---

## 👩‍💻 Author

**Dharani Sindhu** — [GitHub](https://github.com/dharanisindhu161)
