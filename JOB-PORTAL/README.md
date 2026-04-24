# MERN Job / Internship Portal

Production-ready MERN monorepo with a separated `server/` (Express + MongoDB) and `client/` (React + Vite) layout that preserves the existing UI while tightening the folder structure.

## Project Structure

```
job-portal/
├── server/                 # Express API (MVC)
│   ├── config/             # Database connection
│   ├── controllers/        # Auth, internships, applications, companies, users, admin
│   ├── middleware/         # Auth, role, error handlers
│   ├── models/             # User, Company, Internship, Application
│   ├── routes/             # API routes mounted under /api
│   ├── scripts/            # Seed helpers
│   ├── utils/              # Tokens, responses
│   ├── validations/        # Request validation chains
│   ├── app.js              # Express app wiring
│   └── server.js           # Server bootstrap
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/         # Central routing map
│   │   ├── services/       # HTTP helpers & feature services
│   │   ├── App.jsx         # App shell
│   │   ├── main.jsx        # Vite entry
│   │   └── App.css
│   ├── vite.config.js
│   └── package.json
└── README.md               # This file
```

## Quickstart

1) **Install dependencies**

```bash
cd server && npm install
cd ../client && npm install
```

2) **Environment**

- Copy `server/.env.example` to `server/.env` and adjust `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN` as needed.
- Optional: set `client/.env` with `VITE_API_BASE_URL=http://localhost:5000/api` to point at the API.

3) **Run dev servers** (separate terminals)

```bash
# API
cd server && npm run dev

# Frontend
cd client && npm run dev
```

API defaults to `http://localhost:5000/api`, frontend to `http://localhost:5173/`.

## Deployment

- Build frontend: `cd client && npm run build`
- Serve API: `cd server && npm start`
- Point your host (NGINX/Reverse proxy) so `/api` hits the Express server and everything else serves the built `client/dist` assets.
