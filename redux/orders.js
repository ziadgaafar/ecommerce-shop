import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "orders",
  initialState: [],
  reducers: {
    REMOVE_ORDERS_LIST: () => {
      return [];
    },
    ADD_ORDERS_LIST: (state, action) => {
      return action.payload;
    },
    ADD_TO_ORDERS_LIST: (state, action) => {
      const orderList = action.payload;
      return [...state, ...orderList];
    },
  },
});

export const {
  REMOVE_ORDERS_LIST,
  ADD_TO_ORDERS_LIST,
  ADD_ORDERS_LIST,
} = slice.actions;

export default slice.reducer;
