import "./App.css";
// import Login from "./components/Login";
import Body from "./components/Body";
import Dashboard from "./components/Dashboard";
import IntroPage from "./components/Intro";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./utils/store";
import { useSelector } from "react-redux";
import Profile from "./components/Profile";
import Budget from "./components/Budget";
import ExpenseTracker from "./components/Expense";
import ChangePasswordPage from "./components/ChangePassword";
import AuthPage from "./components/Login";
import WalletPage from "./components/Wallet";
import History from "./components/History";

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
             <Route path="password" element={<ChangePasswordPage/>} />
            <Route path="expense" element={<ExpenseTracker />} />
            <Route path="budget" element={<Budget />} />
             <Route path="income" element={<WalletPage />} />
            <Route path="history" element={<History />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
