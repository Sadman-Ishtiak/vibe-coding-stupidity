# Backend (Node/Express/Mongo) - MVC

This backend matches your frontend `services/*` API calls.

## Routes implemented (base: `/api`)
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `PUT /auth/password`

- `GET /users` (admin)
- `GET /users/:id` (admin)
- `PUT /users/:id` (admin)
- `DELETE /users/:id` (admin)
- `PUT /users/:id/approve` (admin)
- `PUT /users/profile` (logged-in)
- `GET /users/applications` (candidate)

- `GET /internships`
- `GET /internships/:id`
- `POST /internships` (company/publisher/admin)
- `PUT /internships/:id` (owner/admin)
- `DELETE /internships/:id` (owner/admin)
- `POST /internships/:id/apply` (candidate)
- `GET /internships/:internshipId/applicants` (owner/admin)
- `GET /internships/:internshipId/best-matches` (owner/admin)

- `POST /chatbot/message` (logged-in)
- `GET /chatbot/history` (logged-in)
- `DELETE /chatbot/history` (logged-in)
- `POST /chatbot/resume-tips` (logged-in)
- `POST /chatbot/analyze-match` (logged-in)

## Setup
1. Create env file:
   - copy `.env.example` to `.env`
2. Install dependencies:
   - `npm install`
3. Run dev server:
   - `npm run dev`

## Notes
- JWT auth: send token via `Authorization: Bearer <token>`.
- Registration: `company` and `publisher` start as `isApproved=false` (admin can approve).
- Chatbot endpoints are placeholder implementations (no external AI calls yet).
