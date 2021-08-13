import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "snackbar",
  initialState: {
    snackbarOpen: false,
    snackbarMessage: "",
    snackbarType: "success",
  },
  reducers: {
    SET_SNACKBAR: (state, action) => {
      const { snackbarOpen, snackbarMessage, snackbarType } = action.payload;
      const newState = {
        ...state,
        snackbarType,
        snackbarOpen: snackbarOpen === false ? false : true,
        snackbarMessage,
      };
      return newState;
    },
  },
});

export const { SET_SNACKBAR } = slice.actions;

export default slice.reducer;
