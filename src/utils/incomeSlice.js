// src/utils/incomeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const incomeSlice = createSlice({
  name: "income",
  initialState: { list: [] },
  reducers: {
    setIncomes(state, action) {
      state.list = action.payload;
    },
    addIncome(state, action) {
      state.list.unshift(action.payload);
    },
    removeIncome(state, action) {
      state.list = state.list.filter(i => i._id !== action.payload);
    },
    updateIncome(state, action) {
      state.list = state.list.map(i =>
        i._id === action.payload._id ? action.payload : i
      );
    },
  },
});

export const { setIncomes, addIncome, removeIncome, updateIncome } = incomeSlice.actions;
export default incomeSlice.reducer;
