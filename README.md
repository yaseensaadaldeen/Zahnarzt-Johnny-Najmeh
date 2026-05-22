# Zahnarzt Johnny Najmeh Website

Production-ready fullstack project rebuilt into the requested structure:

```text
project-root/
├── client/
├── server/
└── README.md
```

## Stack

- Frontend: React 18, React Router v6, Context API, Axios, Framer Motion, FullCalendar
- Backend: Node.js, Express, MongoDB + Mongoose
- Runtime fallback: `mongodb-memory-server` is used automatically when `MONGODB_URI` is not set, so the project runs immediately without a local MongoDB install

## Setup

1. Install root dependencies:

```bash
npm install
```

2. Install app dependencies:

```bash
npm run install:all
```

3. Start frontend and backend together:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173`.

The backend runs on `http://localhost:5000`.

## Optional server environment

Copy `server/.env.example` to `server/.env` if you want to customize values:

```env
PORT=5000
MONGODB_URI=
DOCTOR_ACCESS_CODE=DrJohnny2025
```

If `MONGODB_URI` is empty, the server starts with an in-memory MongoDB instance.

## Included Features

- DE/EN language toggle with German as default
- Public doctor calendar from `GET /api/appointments/public`
- Doctor panel protected by code `DrJohnny2025`
- Doctor CRUD actions: approve, reject/cancel, edit, delete, create
- Admin panel with filters, bulk approve, bulk delete, CSV export
- Persistent settings for working hours, breaks, and holidays
- Reusable appointment table shared by doctor and admin views

## API Endpoints

- `GET /api/appointments/public`
- `GET /api/appointments`
- `POST /api/appointments`
- `PUT /api/appointments/:id`
- `DELETE /api/appointments/:id`
- `PATCH /api/appointments/:id/status`
- `POST /api/appointments/bulk-delete`
- `POST /api/appointments/bulk-approve`
- `GET /api/settings`
- `PUT /api/settings`
- `POST /api/auth/doctor-code`

## Important Note

The workspace did not include a raw Figma token export or exact design frame JSON. This rebuild preserves the locally generated design system already present in the repo as the closest available source of truth.
