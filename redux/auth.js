import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "auth",
  initialState: {
    token: "",
    user: {},
  },
  reducers: {
    LOGIN: (state, action) => {
      const { token, user } = action.payload;
      const newState = {
        ...state,
        token,
        user,
      };
      return newState;
    },
    LOGOUT: (state) => {
      const newState = {
        token: null,
        user: null,
      };
      return newState;
    },
    UPDATE_USER: (state, action) => {
      const newUser = {
        ...state.user,
        ...action.payload,
      };
      return {
        ...state,
        user: newUser,
      };
    },
  },
});

export const { LOGIN, LOGOUT, UPDATE_USER } = slice.actions;

export default slice.reducer;
