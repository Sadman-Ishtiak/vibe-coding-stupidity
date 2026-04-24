# InternNova (MERN Frontend)

React (JSX) + Vite frontend migrated from the InternNova job board template.

## Tech

- React + Vite (JavaScript only)
- React Router (SPA routing)
- Template assets/styles loaded from `public/assets` for pixel-perfect UI

## Architecture (MVC-style)

- **Models**: `src/models` (schemas, API shapes, constants, mock data)
- **Views**: `src/views` + `src/components` (JSX pages/components)
- **Controllers**: `src/controllers` (business logic, API utilities, state hooks)

## Environment

Copy `.env.example` → `.env` and set your backend:

- `VITE_API_BASE_URL=http://localhost:5000/api`
- `VITE_USE_MOCKS=true` (optional fallback for local development)

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
