# AetherBridge – Developer Guide

## 1. Project overview

**AetherBridge** is an **Academic Mobility** web app: students can browse courses, enroll, view credentials, apply for transfers, and use blockchain-backed credentials. It is a full-stack app with a React (Vite + TypeScript) frontend and an Express (Node.js) backend.

### What you should know as the developer

| Layer | Tech | Location | Notes |
|-------|------|----------|--------|
| **Frontend** | React 18, Vite, TypeScript, Tailwind, shadcn/ui, React Query | `src/` | SPA; API base URL must point to backend `/api`. |
| **Backend** | Express, Node 18+ | `backend/` | REST API under `/api/*`. Auth is token-based (dev token supported). |
| **Data** | In-memory (default), optional MongoDB/PostgreSQL | `backend/services/database.js` | Default is in-memory; no DB install required for dev. |
| **Auth** | Firebase (optional), dev token | `src/hooks/useAuth.tsx`, `backend/middleware/auth.js` | Backend accepts any token in dev and sets a mock user. |

### Main flows (by feature)

- **Dashboard** – Overview, quick actions; data from `/api/dashboard` (or frontend mock if API fails).
- **Courses** – List, filter, enroll, “My courses”; **first feature made fully functional end-to-end** (see below).
- **Events** – List and register; backend has mock data in `backend/routes/events.js`; frontend can be wired to API.
- **Credentials / NFT / Wallet / Application / Equivalency / Mentorship / Assessment** – Partially implemented or mock; can be extended later.

---

## 2. Database options

Backend supports three modes (see `backend/services/database.js` and `config.env.example`):

| Option | When to use | Setup |
|--------|-------------|--------|
| **In-memory** | Local dev, demos, “one page working” | Default. Set `USE_IN_MEMORY_STORAGE=true` or leave MongoDB/PostgreSQL unset. No install. Data is lost on restart. |
| **MongoDB** | When you want a real DB, document model | Install MongoDB, set `MONGODB_URI`. Disable in-memory: don’t set `USE_IN_MEMORY_STORAGE=true`. |
| **PostgreSQL** | When you want SQL, relations, reporting | Install PostgreSQL, set `POSTGRES_*` or `POSTGRES_URI`. |

**Recommendation for “easiest one page working”:** use **in-memory** only. No database install; backend seeds courses and you get a full Courses flow (list, filters, enroll, “My courses”) that works end-to-end.

For persistence later, add **MongoDB** (e.g. Atlas free tier) or **PostgreSQL** (e.g. local or Neon) and switch env vars as in `config.env.example`.

---

## 3. One feature fully functional end-to-end: Courses

The **Courses** feature is the one implemented for full **end-to-end** behavior with the least effort.

### Flow

1. **Backend** (default in-memory):
   - Seeds a small list of courses on startup.
   - `GET /api/courses` – list/filter courses from storage.
   - `GET /api/courses/enrolled` – list courses the current user is enrolled in (must be before `GET /api/courses/:id`).
   - `GET /api/courses/:id` – course by id.
   - `POST /api/courses/:id/enroll` – enroll current user; stored in memory (per user).

2. **Frontend**:
   - **Courses** page: calls `getCourses()`, `getEnrolledCourses()`, `enrollInCourse()` from `src/lib/api.ts`.
   - API base URL includes `/api`; if backend is down, the app can still show mock courses so the page loads.

3. **Data**:
   - Courses live in the backend store (in-memory Map or MongoDB/PostgreSQL when configured).
   - Enrollments are stored per user in memory (or can be moved to DB later).

### How to run and verify

1. **Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   Server runs at `http://localhost:8000`. Health: `http://localhost:8000/health`. Uses **in-memory** storage by default (no DB install). Five courses are seeded on startup.

2. **Frontend**
   ```bash
   npm install
   npm run dev
   ```
   App runs at `http://localhost:8086` (or next free port). Ensure `.env` has `VITE_API_URL=http://localhost:8000` (no `/api` suffix; the client adds it). The frontend sends `Authorization: Bearer dev-token-123`; the backend accepts it and treats the user as `dev-user-123`.

3. **Test (end-to-end)**
   - Open **Courses** in the app: you should see 5 seeded courses from the backend.
   - Use search/filters: they hit `GET /api/courses?...`.
   - Click **Enroll** on a course: `POST /api/courses/:id/enroll` runs and stores the enrollment in memory.
   - Open the **“My Courses”** tab (or section): `GET /api/courses/enrolled` returns the courses you enrolled in; the list updates after each enroll.

---

## 4. Project layout (short)

```
aetherbridge-ui-main/
├── src/
│   ├── App.tsx              # Routes, layout, auth wrapper
│   ├── main.tsx
│   ├── index.css            # Theme (CSS variables)
│   ├── lib/
│   │   └── api.ts           # All API calls; base URL + /api
│   ├── pages/               # One file per route (Dashboard, Courses, Events, …)
│   ├── components/          # UI + app-sidebar, header
│   └── hooks/               # useAuth, useToast, etc.
├── backend/
│   ├── server.js            # Express app, CORS, /api routes
│   ├── routes/              # courses.js, events.js, dashboard.js, …
│   ├── services/
│   │   └── database.js     # In-memory + MongoDB/PostgreSQL init and helpers
│   └── middleware/          # auth.js, errorHandler.js
├── .env                     # VITE_API_URL for frontend
├── backend/.env             # PORT, USE_IN_MEMORY_STORAGE, DB URLs, etc.
└── DEVELOPER_GUIDE.md       # This file
```

---

## 5. Next steps (after Courses works)

- **Events:** Wire Events page to `getEvents()` and `registerForEvent()` and (optionally) store registrations in backend (e.g. in-memory or DB).
- **Auth:** Replace dev token with real Firebase or JWT and use `req.user` in all protected routes.
- **Database:** Add MongoDB or PostgreSQL, seed courses (and later enrollments) there, and switch env so the same Courses API runs against the DB.
- **Credentials / NFT / Wallet:** Implement or stub remaining APIs and connect the corresponding pages.

You can go through these one by one; the Courses flow is the baseline for “at least one page working end-to-end.”
