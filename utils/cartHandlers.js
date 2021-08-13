import { SET_SNACKBAR } from "../redux/snackbar";
import { ADD_TO_CART, REMOVE_FROM_CART } from "../redux/cart";

export const addToCartHandler = (dispatch, product, cart) => {
  const check = cart.every((item) => item._id !== product._id);
  if (product.inStock > 0 && check) {
    dispatch(ADD_TO_CART(product));
    dispatch(
      SET_SNACKBAR({
        snackbarMessage: `${product.title} Added to Cart!`,
        snackbarType: "success",
      })
    );
  } else {
    dispatch(
      SET_SNACKBAR({
        snackbarMessage: product.inStock
          ? "Product is already in the cart!"
          : "Product is Out of Stock!",
        snackbarType: "error",
      })
    );
  }
};

export const removeFromCartHandler = (dispatch, index, title) => {
  dispatch(REMOVE_FROM_CART(index));
  dispatch(
    SET_SNACKBAR({
      snackbarMessage: `${title} Removed from Cart!`,
      snackbarType: "success",
    })
  );
};
