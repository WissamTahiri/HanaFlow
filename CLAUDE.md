# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HanaFlow is an SAP educational platform built with a separate frontend/backend architecture. It teaches SAP modules (FI, CO, MM, SD, HCM, PP) and S/4HANA concepts to users.

## Development Commands

### Backend (`Back-End/`)
```bash
npm run dev    # Start with nodemon (auto-reload)
npm start      # Start without auto-reload
```
Server runs on port 5000 (configured via `.env`).

### Frontend (`Front-End/`)
```bash
npm run dev      # Vite dev server on port 5173
npm run build    # Production build
npm run preview  # Preview production build
node scripts/generate-sitemap.cjs  # Generate sitemap
```

There are no configured test runners or linters in either package.

## Architecture

### Backend (`Back-End/server.js`)
- Express.js 5 API with JWT authentication (bcryptjs + jsonwebtoken)
- **In-memory user store** — no database; data resets on server restart
- CORS configured for `localhost:5173` only
- Key routes: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`

### Frontend (`Front-End/src/`)
- React 18 + Vite 6, styled with Tailwind CSS (custom SAP brand colors: `sapBlue`, `sapBlueDark`, `sapGrayLight`)
- React Router v6 for client-side routing
- `AuthContext` (`context/AuthContext.jsx`) manages authentication state globally — wraps the entire app in `main.jsx`
- `ProtectedRoute` component guards authenticated routes
- API base URL configured in `config/api.js`
- Path aliases: `@components`, `@pages`, `@layouts`, `@routes` (defined in `jsconfig.json`, resolved by Vite)

### Key Frontend Directories
- `pages/` — Route-level components including SAP module pages (`FI.jsx`, `CO.jsx`, `MM.jsx`, `SD.jsx`, `HCM.jsx`, `PP.jsx`, `AIJoule.jsx`) which are large static content files (~23–28KB each)
- `components/` — Reusable UI: `Navbar.jsx`, `Footer.jsx`, `DarkModeToggle.jsx`, `SEO.jsx`, `HeroHome.jsx`, `ProtectedRoute.jsx`
- `layouts/` — Layout wrappers
- `routes/` — Route definitions

### Current Limitations
- Authentication is partially mocked — `AuthContext` handles fake tokens; the backend has real JWT logic but the frontend may not fully integrate it
- No persistent storage (in-memory only on backend)
- No tests configured
