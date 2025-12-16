# BudgetBuddy

BudgetBuddy is a full‑stack personal finance tracker that helps users manage budgets, track expenses and incomes, and visualize financial health. This repository includes the React front‑end (Vite + Tailwind) and a Node.js/Express back‑end with MongoDB.

Use this README to quickly set up both apps, understand the architecture and data flow, and locate key files and API routes.

## Overview
 - Frontend: React (Vite), Redux Toolkit, Axios, Tailwind CSS
 - Backend: Node.js, Express, MongoDB (Mongoose), JWT auth
 - Features: User auth, dashboard insights, budgets, categories, expenses, incomes, profile management

## Folder Structure
 - Frontend app: `BudgetApp/`
 - Backend API: `budgetBuddy-backend/`

Key frontend files:
 - `src/App.jsx` – app shell and routing
 - `src/components/*` – UI sections (Dashboard, Budget, Expense, Wallet, etc.)
 - `src/utils/*` – Redux slices, store, axios instance, constants

Key backend files:
 - `budgetBuddy-backend/app.js` – Express app bootstrap
 - `budgetBuddy-backend/src/config/database.js` – Mongo connection
 - `budgetBuddy-backend/src/config/middleware/auth.js` – JWT auth middleware
 - `budgetBuddy-backend/src/config/router/*` – API route modules
 - `budgetBuddy-backend/src/config/model/*` – Mongoose models
 - `budgetBuddy-backend/src/config/utils/validate.js` – validation helpers

## Prerequisites
 - Node.js LTS (v18+) and npm
 - MongoDB (local or Atlas connection string)
 - Windows PowerShell/Terminal (commands provided for Windows)

## Quick Start

### 1) Clone and install
```powershell
# From your workspace root
# Frontend
cd BudgetApp
npm install

# Backend
cd ../budgetBuddy-backend
npm install
```

### 2) Configure environment variables

Backend `.env` (create in `budgetBuddy-backend/`):
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/budgetbuddy
JWT_SECRET=change_this_in_production
CORS_ORIGIN=http://localhost:5173
```

Frontend `.env` (create in `BudgetApp/`):
```
VITE_API_BASE_URL=http://localhost:3000
```

### 3) Run both apps
```powershell
# Backend
cd budgetBuddy-backend
npm run start

# Frontend (in a second terminal)
cd BudgetApp
npm run dev
```

Default URLs:
 - Frontend: http://localhost:5173
 - Backend API: http://localhost:3000

## Tech Stack
 - React + Vite for fast dev and build
 - Redux Toolkit for state management (slices under `src/utils/*Slice.js`)
 - Axios for API calls (`src/utils/axios.js` with base URL)
 - Tailwind CSS for styling
 - Express + Mongoose for REST API and DB models
 - JWT for authentication

## Architecture & Data Flow
1. User logs in via `POST /api/auth/login` → backend issues JWT.
2. Frontend stores token (Redux) and attaches it via `axios` to protected API calls.
3. Redux slices (e.g., `budgetSlice`, `expenseSlice`, `incomeSlice`) fetch and update domain data.
4. Components subscribe to slice selectors to render dashboards and details.

## Backend API Summary
Base path: `/`

 - Auth: `authRouter.js`
   - `POST /signup` – create user
   - `POST /login` – authenticate and receive JWT (cookie)
   - `POST /logout` – clear session cookie (auth)
 - Profile: `profileRouter.js`
   - `GET /profile/view` – get user profile (auth)
   - `PATCH /profile/update` – update profile (auth)
   - `PATCH /profile/updatePassword` – change password (auth)
 - Categories: `categoryRouter.js`
   - `GET /category` – list categories (default + user) (auth)
   - `POST /user/category` – create category (auth)
   - `PATCH /user/category/:categoryId` – update category (auth)
   - `DELETE /user/category/:categoryId` – delete category (auth)
 - Budgets: `budgetRouter.js`
   - `GET /user/budget` – list budgets (auth)
   - `POST /user/budget` – create budget (auth)
   - `PATCH /user/budget/:budgetId` – update budget (auth)
   - `DELETE /user/budget/:id` – delete budget (auth)
 - Expenses: `expenseRouter.js`
   - `GET /user/expense` – list expenses (auth)
   - `POST /user/expense` – create expense (auth)
   - `PATCH /user/expense/:expenseId` – update expense (auth)
   - `DELETE /user/expense/:expenseId` – delete expense (auth)
 - Income: `incomeRouter.js`
   - `GET /user/income` – list incomes (auth)
   - `POST /user/income` – create income (auth)
   - `PATCH /user/income/:incomeId` – update income (auth)
   - `DELETE /user/income/:incomeId` – delete income (auth)
Note: Exact responses depend on the implementation under `src/config/router` and models.

## Frontend Configuration
 - `src/utils/axios.js` reads `VITE_API_BASE_URL`. Ensure it points to the backend URL.
 - Redux store in `src/utils/store.js` registers slices: `userSlice`, `dashboardSlice`, `budgetSlice`, `expenseSlice`, `incomeSlice`, `menuSlice`, `categorySlice`.
 - UI components under `src/components/*` map to app sections:
	 - `Login.jsx`, `ChangePassword.jsx`, `Profile.jsx`
	 - `Dashboard.jsx`, `Budget.jsx`, `Expense.jsx`, `Wallet.jsx`
	 - `Navbar.jsx`, `Sidebar.jsx`, `Footer.jsx`, `Intro.jsx`, `Body.jsx`

## Scripts
Frontend (`BudgetApp/package.json`):
 - `dev` – Start Vite dev server
 - `build` – Build production assets
 - `preview` – Preview built app

Backend (`budgetBuddy-backend/package.json`):
 - `start` – Start Express server
 - `dev` – Start with nodemon (if configured)

## Testing & Linting
 - ESLint config at `BudgetApp/eslint.config.js`
 - Consider adding backend tests with Jest/Supertest and frontend tests with Vitest/RTL.

## Deployment
 - Frontend: build with `npm run build` and host static files (e.g., Netlify, Vercel, or any static host).
 - Backend: deploy to a Node.js host (e.g., Render, Railway, Azure App Service, Heroku alternative) with environment variables set.
 - Set CORS correctly (`CORS_ORIGIN`) to allow the frontend domain.

## Troubleshooting
 - Frontend cannot reach API: verify `VITE_API_BASE_URL` and backend `PORT`.
 - 401 errors: ensure JWT token is present and not expired.
 - Mongo errors: check `MONGODB_URI` and database availability.
 - CORS blocked: confirm `CORS_ORIGIN` matches the frontend origin.

## Contribution
 - Fork, create a feature branch, commit with clear messages, and open a PR.
 - Discuss larger changes in issues first.

## License
This project is intended for educational/demo purposes. Add a license if you plan broader use.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
