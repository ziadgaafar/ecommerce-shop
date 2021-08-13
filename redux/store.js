import { configureStore } from "@reduxjs/toolkit";
import snackbarReducer from "./snackbar";
import authReducer from "./auth";
import loadingReducer from "./loading";
import cartReducer from "./cart";
import ordersReducer from "./orders";
import usersReducer from "./users";
import categoriesReducer from "./categories";

export default configureStore({
  reducer: {
    snackbar: snackbarReducer,
    auth: authReducer,
    loading: loadingReducer,
    cart: cartReducer,
    orders: ordersReducer,
    users: usersReducer,
    categories: categoriesReducer,
  },
});
