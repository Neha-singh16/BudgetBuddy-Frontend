import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name : "user",
    initialState : null,
    reducers : {
      
        removeUser : (state) => {
           state = null;
           return state;
        }, setUser: (state, action) => action.payload,
    }

    
})

export const { removeUser ,setUser} = userSlice.actions;
export default userSlice.reducer;

