import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    ADD_CART: (state, action) => {
      let newCart = [];
      action.payload.map((item) => newCart.push(item));
      return newCart;
    },
    ADD_TO_CART: (state, action) => {
      state.push({ ...action.payload, quantity: 1 });
    },
    REMOVE_FROM_CART: (state, action) => {
      state.splice(action.payload, 1);
    },
    INCREMENT: (state, action) => {
      const { index, cart } = action.payload;
      if (cart[index].quantity < cart[index].inStock) {
        state[index].quantity = cart[index].quantity + 1;
      }
    },
    DECREMENT: (state, action) => {
      const { index, cart } = action.payload;
      if (cart[index].quantity > 1) {
        state[index].quantity = cart[index].quantity - 1;
      }
    },
  },
});

export const {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  ADD_CART,
  INCREMENT,
  DECREMENT,
} = slice.actions;

export default slice.reducer;
