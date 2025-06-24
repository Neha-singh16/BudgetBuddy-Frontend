import { configureStore } from "@reduxjs/toolkit";
import menuSlice from "./menuSlice";
import userSlice from "./userSlice";
import budgetReducer from "./budgetSlice";
import categoryReducer from "./categorySlice";
import expenseReducer from "./expenseSlice";
import dashboardReducer from "./dashboardSlice";
import incomeReducer from "./incomeSlice";

const store = configureStore({
  reducer: {
    menu: menuSlice,
    user: userSlice,
    expense: expenseReducer,
    budget: budgetReducer,
    category: categoryReducer,
    dashboard: dashboardReducer,
    income: incomeReducer,
  },
});

export default store;
