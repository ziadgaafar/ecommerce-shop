import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    REMOVE_USERS_LIST: () => {
      return [];
    },
    ADD_USERS_LIST: (state, action) => {
      return action.payload;
    },
    ADD_TO_USERS_LIST: (state, action) => {
      const orderList = action.payload;
      return [...state, ...orderList];
    },
  },
});

export const {
  REMOVE_USERS_LIST,
  ADD_TO_USERS_LIST,
  ADD_USERS_LIST,
} = slice.actions;

export default slice.reducer;
