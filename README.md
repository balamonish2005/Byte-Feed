# ByteFeed — Food Redistribution Platform

A full-stack prototype connecting Restaurants/Caterers, NGOs, and Admins to
redistribute surplus food, built around a review-based restaurant trust
rating system.

## Stack

- **Frontend:** React (Vite) + Tailwind CSS + React Router
- **Backend:** Node.js + Express + Socket.IO
- **Database:** MySQL via Sequelize
- **Auth:** JWT, role-based access control (admin / restaurant / ngo)
- **Images:** local disk storage via multer

## Project structure

```
bytefeed/
  backend/
    config/       # DB connection, admin seed script
    models/       # Sequelize models + associations
    controllers/  # Route handlers
    routes/       # Express routers
    middleware/   # JWT auth, RBAC, file upload
    uploads/       # Donation food images (created at runtime)
    server.js
  frontend/
    src/
      api/         # Axios instance with JWT interceptor
      context/     # AuthContext (login state)
      components/  # Shared UI (cards, badges, sidebar, stars)
      pages/       # Landing, auth, and role dashboards
      routes/      # ProtectedRoute wrapper
```

## Setup

### 1. Database

Install and start MySQL 8 locally. The default connection is `127.0.0.1:3306`.
Set `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_HOST`, and
`MYSQL_PORT` in `backend/.env` to match your MySQL server. Do not reuse a
PostgreSQL password unless it is also the MySQL account password.

### 2. Backend

```bash
cd backend
cp .env.example .env      # then set MySQL credentials / JWT_SECRET
npm install
npm run db:create           # creates the bytefeed database
npm run seed               # creates the initial admin account
npm run dev                 # starts on http://localhost:5000
```

Seeded admin login: `admin@bytefeed.local` / `Admin@123`
(sequelize.sync({ alter: true }) creates tables automatically on first run —
swap for real migrations before production use.)

### 3. Frontend

```bash
cd frontend
npm install
npm run dev                 # starts on http://localhost:5173
```

The Vite dev server proxies `/api`, `/uploads`, and `/socket.io` to
`http://localhost:5000`, so no extra local proxy setup is needed. Authenticated
clients receive live updates for new donations, handoff status changes, NGO
requests, reviews, and account deactivation.

## Roles & workflow

- **Restaurant / Catering:** register, post donations with a photo, edit or
  delete while pending, track status, view reviews and trust rating.
- **NGO:** browse and search/filter available donations, accept one, mark it
  collected then completed, and leave a required review (rating, food
  quality, packaging, freshness, optional comment).
- **Admin:** seeded account only. View all users/restaurants/NGOs/donations/
  reviews, activate or deactivate accounts, hide inappropriate reviews, and
  see platform-wide stats.

## Notes

- Every completed donation permits exactly one NGO review, enforced both in
  the UI and the API.
- A restaurant's `avgRating` and the per-category `Rating` snapshot recompute
  automatically whenever a review is created or an admin hides one.
- Maps use OpenStreetMap tiles and require an internet connection.
- Existing records in a PostgreSQL database are not copied automatically;
  export/import them before switching a populated deployment to MySQL.
