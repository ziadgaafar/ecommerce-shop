import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "categories",
  initialState: [],
  reducers: {
    REMOVE_CATEGORIES_LIST: () => {
      return [];
    },
    ADD_CATEGORIES_LIST: (state, action) => {
      return action.payload;
    },
    ADD_TO_CATEGORIES_LIST: (state, action) => {
      const categoriesList = action.payload;
      return [...state, ...categoriesList];
    },
  },
});

export const {
  REMOVE_CATEGORIES_LIST,
  ADD_TO_CATEGORIES_LIST,
  ADD_CATEGORIES_LIST,
} = slice.actions;

export default slice.reducer;
