import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "loading",
  initialState: {
    isLoading: false,
  },
  reducers: {
    SET_LOADING: (state, action) => {
      const newState = { ...state, isLoading: action.payload };
      return newState;
    },
  },
});

export const { SET_LOADING } = slice.actions;

export default slice.reducer;
