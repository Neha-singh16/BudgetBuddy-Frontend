# BudgetBuddy Frontend 💰

A modern, feature-rich personal finance management application built with React, Redux Toolkit, and Tailwind CSS. BudgetBuddy helps users track expenses, manage budgets, monitor income, and gain insights into their financial health through interactive visualizations.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure login/signup with JWT-based authentication
- **Dashboard Analytics**: Real-time financial overview with charts and metrics
- **Expense Tracking**: Add, edit, delete, and categorize expenses
- **Budget Management**: Create and monitor budgets with visual progress indicators
- **Income Tracking**: Record and manage multiple income sources
- **Category System**: Pre-defined and custom categories for better organization
- **Profile Management**: Update user information and change password
- **Responsive Design**: Mobile-first, fully responsive UI

### UI/UX Highlights
- Modern, clean interface with Tailwind CSS
- Smooth animations with Framer Motion
- Interactive charts using Recharts
- Real-time data updates
- Intuitive navigation with React Router

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework |
| **Vite** | Build tool and dev server |
| **Redux Toolkit** | State management |
| **React Router v7** | Client-side routing |
| **Tailwind CSS v4** | Styling framework |
| **Axios** | HTTP client |
| **Recharts** | Data visualization |
| **Framer Motion** | Animations |
| **Lucide React** | Icon library |
| **Heroicons** | Additional icons |

## 📁 Project Structure

```
BudgetApp/
├── public/                    # Static assets
├── src/
│   ├── components/           # React components
│   │   ├── Intro.jsx        # Landing/intro page
│   │   ├── Login.jsx        # Authentication page
│   │   ├── Body.jsx         # Main layout wrapper
│   │   ├── Navbar.jsx       # Top navigation
│   │   ├── Sidebar.jsx      # Side navigation menu
│   │   ├── Dashboard.jsx    # Analytics dashboard
│   │   ├── Expense.jsx      # Expense tracker
│   │   ├── Budget.jsx       # Budget management
│   │   ├── Wallet.jsx       # Income management
│   │   ├── Profile.jsx      # User profile
│   │   ├── ChangePassword.jsx # Password update
│   │   └── Footer.jsx       # Footer component
│   ├── utils/               # Redux & utilities
│   │   ├── store.js        # Redux store configuration
│   │   ├── userSlice.js    # User state management
│   │   ├── expenseSlice.js # Expense state
│   │   ├── budgetSlice.js  # Budget state
│   │   ├── incomeSlice.js  # Income state
│   │   ├── categorySlice.js # Category state
│   │   ├── dashboardSlice.js # Dashboard state
│   │   ├── menuSlice.js    # UI state
│   │   ├── axios.js        # Axios instance
│   │   └── constant.js     # API endpoints & constants
│   ├── App.jsx             # Main app component
│   ├── App.css             # Global styles
│   ├── main.jsx            # App entry point
│   └── index.css           # Tailwind imports
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.cjs      # PostCSS configuration
├── eslint.config.js        # ESLint configuration
└── package.json            # Dependencies & scripts
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **npm** or **yarn**
- Backend server running (see backend README)

### Installation

1. **Navigate to frontend directory**
   ```powershell
   cd BudgetApp
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Configure environment** (Optional)
   
   Create `.env` file if needed to override backend URL:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. **Start development server**
   ```powershell
   npm run dev
   ```

   The app will open at `http://localhost:5173`

### Available Scripts

```powershell
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🔄 Application Flow

### 1. Authentication Flow
```
User visits "/" (Intro Page)
  ↓
Clicks "Get Started" → Navigates to "/login"
  ↓
Enters credentials → POST /login
  ↓
Receives JWT token in cookie
  ↓
Redirects to "/app/dashboard"
```

### 2. Dashboard Flow
```
Dashboard loads → Fetches data from 4 APIs in parallel:
  ├── GET /user/budget    (Budget data)
  ├── GET /user/expense   (Expense data)
  ├── GET /category       (Categories)
  └── GET /user/income    (Income data)
        ↓
  Data stored in Redux slices
        ↓
  Components re-render with updated data
        ↓
  Charts & metrics calculated and displayed
```

### 3. Expense Management Flow
```
User navigates to "/app/expense"
  ↓
View all expenses with filters/search
  ↓
Add new expense:
  - Select category
  - Enter amount & description
  - Choose date
  - Select budget (optional)
  ↓
POST /user/expense
  ↓
Redux state updated → UI refreshes
```

### 4. Budget Management Flow
```
User navigates to "/app/budget"
  ↓
View all budgets with progress bars
  ↓
Create new budget:
  - Set limit amount
  - Choose category
  - Set time period
  ↓
POST /user/budget
  ↓
Budget tracked against expenses
  ↓
Visual indicators show spending progress
```

## 🗂️ State Management (Redux)

### Redux Slices

| Slice | State | Purpose |
|-------|-------|---------|
| `userSlice` | User profile, auth status | Manages logged-in user data |
| `expenseSlice` | Expenses array | Tracks all user expenses |
| `budgetSlice` | Budgets array | Manages budget configurations |
| `incomeSlice` | Income sources | Tracks income entries |
| `categorySlice` | Categories | Stores expense categories |
| `dashboardSlice` | Period, filters | Dashboard view preferences |
| `menuSlice` | UI state | Sidebar/menu visibility |

### Example: Fetching & Storing Data
```javascript
// In component
import { setExpenses } from '../utils/expenseSlice';
import { useDispatch } from 'react-redux';

const dispatch = useDispatch();

// Fetch data
const response = await fetch('http://localhost:3000/user/expense', {
  credentials: 'include'
});
const data = await response.json();

// Update Redux store
dispatch(setExpenses(data));
```

## 🎨 Styling Architecture

- **Tailwind CSS v4** for utility-first styling
- **Custom color palette** matching brand identity
- **Responsive breakpoints**: mobile, tablet, desktop
- **Dark mode ready** (can be implemented)
- **Framer Motion** for smooth transitions and animations

## 🔗 API Integration

### Base URL Configuration
```javascript
// src/utils/constant.js
export const USER = "http://localhost:3000";
```

### API Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/signup` | Create new account |
| POST | `/login` | Authenticate user |
| POST | `/logout` | End session |
| GET | `/profile` | Get user profile |
| PATCH | `/profile` | Update profile |
| PATCH | `/profile/password` | Change password |
| GET | `/user/expense` | Fetch all expenses |
| POST | `/user/expense` | Create expense |
| PATCH | `/user/expense/:id` | Update expense |
| DELETE | `/user/expense/:id` | Delete expense |
| GET | `/user/budget` | Fetch all budgets |
| POST | `/user/budget` | Create budget |
| PATCH | `/user/budget/:id` | Update budget |
| DELETE | `/user/budget/:id` | Delete budget |
| GET | `/user/income` | Fetch all income |
| POST | `/user/income` | Create income |
| PATCH | `/user/income/:id` | Update income |
| DELETE | `/user/income/:id` | Delete income |
| GET | `/category` | Fetch categories |
| POST | `/category` | Create custom category |

### Authentication
All requests include credentials:
```javascript
fetch(url, { credentials: 'include' })
```

JWT token stored in httpOnly cookie for security.

## 🧩 Key Components

### Dashboard
- **Metrics Cards**: Total income, budget, spent, remaining
- **Pie Chart**: Expense breakdown by category
- **Line Chart**: Spending trends over time
- **Budget Progress**: Visual indicators for each budget

### Expense Tracker
- **Expense List**: Filterable, searchable table
- **Add Form**: Modal with category/budget selection
- **Quick Actions**: Edit, delete inline
- **Statistics**: Monthly/weekly totals

### Budget Manager
- **Budget Cards**: Visual progress indicators
- **Budget Form**: Set limits by category
- **Alerts**: Notifications when exceeding limits
- **Analytics**: Spending vs. budget comparison

### Wallet (Income)
- **Income Sources**: List all income entries
- **Add Income**: Form for new income
- **Summary**: Total income calculation
- **History**: Track income over time

## 🔒 Security Features

- JWT-based authentication
- httpOnly cookies prevent XSS attacks
- Credentials sent with every request
- Protected routes (redirect to login if not authenticated)
- Form validation on client side
- Secure password requirements

## 📱 Responsive Design

- **Mobile First**: Optimized for small screens
- **Breakpoints**:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- **Adaptive Navigation**: Hamburger menu on mobile
- **Touch-friendly**: Large tap targets

## 🐛 Debugging Tips

### Common Issues

**Problem**: API requests fail with CORS error
- **Solution**: Ensure backend CORS allows `http://localhost:5173`

**Problem**: Login successful but redirect doesn't work
- **Solution**: Check Redux user state is populated

**Problem**: Data not updating after API call
- **Solution**: Verify Redux dispatch is called after fetch

### Development Tools
```javascript
// Redux DevTools - inspect state changes
// React DevTools - component hierarchy
// Network tab - monitor API calls
```

## 🚀 Production Build

### Build for Production
```powershell
npm run build
```

### Preview Production Build
```powershell
npm run preview
```

### Deployment Checklist
- [ ] Update API URL to production backend
- [ ] Configure environment variables
- [ ] Test all features in production mode
- [ ] Optimize bundle size
- [ ] Enable compression
- [ ] Configure CDN for static assets

## 🔧 Configuration Files

### Vite Config
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { /* optional proxy config */ }
  }
})
```

### Tailwind Config
```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: { /* custom colors, fonts */ } }
}
```

## 📈 Performance Optimization

- Code splitting with React.lazy (can be added)
- Memoization with React.memo for heavy components
- Debounced search/filter inputs
- Optimized re-renders with proper Redux selectors
- Image optimization
- Bundle size monitoring

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- React team for amazing framework
- Tailwind CSS for utility-first CSS
- Recharts for beautiful charts
- All open-source contributors

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review backend README for API details

---

**Happy Budgeting! 💰📊**
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
