import { configureStore, combineReducers } from "@reduxjs/toolkit";
import menuSlice from "./menuSlice";
import userSlice from "./userSlice";
import budgetReducer from "./budgetSlice";
import categoryReducer from "./categorySlice";
import expenseReducer from "./expenseSlice";
import dashboardReducer from "./dashboardSlice";
import incomeReducer from "./incomeSlice";

// Combine reducers first
const appReducer = combineReducers({
  menu: menuSlice,
  user: userSlice,
  expense: expenseReducer,
  budget: budgetReducer,
  category: categoryReducer,
  dashboard: dashboardReducer,
  income: incomeReducer,
});

// Root reducer that resets the whole store when user logs out
const rootReducer = (state, action) => {
  if (action.type === "user/removeUser") {
    state = undefined; // let all slices return to their initial state
  }
  return appReducer(state, action);
};

const store = configureStore({ reducer: rootReducer });

export default store;
