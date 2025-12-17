import "./App.css";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import Body from "./components/Body";
import store from "./utils/store";

const IntroPage = lazy(() => import("./components/Intro"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const Profile = lazy(() => import("./components/Profile"));
const Budget = lazy(() => import("./components/Budget"));
const ExpenseTracker = lazy(() => import("./components/Expense"));
const ChangePasswordPage = lazy(() => import("./components/ChangePassword"));
const AuthPage = lazy(() => import("./components/Login"));
const WalletPage = lazy(() => import("./components/Wallet"));
const History = lazy(() => import("./components/History"));

// Redirect away from login if already authenticated
function RedirectIfAuthenticated({ children }) {
  const user = useSelector((s) => s.user);
  const location = useLocation();
  if (user && user._id) {
    return <Navigate to="/app/dashboard" replace state={{ from: location }} />;
  }
  return children;
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="w-full min-h-screen flex items-center justify-center text-gray-600">
              Loading...
            </div>
          }
        >
          <Routes>
            {/* First visit: Intro Page */}
            <Route path="/" element={<IntroPage />} />

            <Route
              path="login"
              element={
                <RedirectIfAuthenticated>
                  <AuthPage />
                </RedirectIfAuthenticated>
              }
            />

            <Route path="/app" element={<Body />}>
              <Route path="dashboard" index element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="password" element={<ChangePasswordPage />} />
              <Route path="expense" element={<ExpenseTracker />} />
              <Route path="budget" element={<Budget />} />
              <Route path="income" element={<WalletPage />} />
              <Route path="history" element={<History />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
