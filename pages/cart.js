import {
  Button,
  Container,
  Divider,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  TextField,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { removeFromCartHandler } from "../utils/cartHandlers";
import CartItem from "../components/CartItem";
import { ADD_CART, DECREMENT, INCREMENT } from "../redux/cart";
import { useEffect, useState } from "react";
import { useHttpClient } from "../hooks/http-hook";
import { useFormik } from "formik";
import * as yup from "yup";
import { SET_SNACKBAR } from "../redux/snackbar";
import { KeyboardBackspace } from "@material-ui/icons";
import Head from "next/head";

const phoneRegExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

const schema = yup.object().shape({
  address: yup
    .string()
    .required("Address is required!")
    .min(3, "Enter a Correct Address"),
  phoneNumber: yup
    .string()
    .required("Phone Number is Required!")
    .matches(phoneRegExp, "Enter a Correct Phone Number!"),
});

const Cart = ({}) => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const { sendRequest } = useHttpClient();
  const { cart, auth } = useSelector((state) => state);
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [totalPrice, setTotalPrice] = useState(0);

  const fetch = async () => {
    let newCart = [];
    const localCart = JSON.parse(localStorage.getItem("__next__cart01__eshop"));
    if (localCart && localCart.length > 0) {
      for (const item of localCart) {
        const resData = await sendRequest({
          ignoreSnackbar: true,
          url: `/products/${item._id}`,
        });
        const { inStock } = resData.product;
        if (inStock > 0) {
          newCart.push({
            ...resData.product,
            quantity: item.inStock > inStock ? 1 : item.quantity,
          });
        }
      }
      dispatch(ADD_CART(newCart));
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    let sum = 0;
    if (cart && cart.length > 0) {
      cart.map((item) => {
        sum += item.price * item.quantity;
      });
    }
    setTotalPrice(sum);
  }, [cart]);

  const formik = useFormik({
    initialValues: { address: "", phoneNumber: "" },
    validationSchema: schema,
    onSubmit: async (values) => {
      if (auth.token) {
        for (const item of cart) {
          const data = await sendRequest({
            ignoreSnackbar: true,
            url: `/products/${item._id}`,
          });
          const { inStock } = data.product;
          if (inStock < item.quantity) {
            dispatch(
              SET_SNACKBAR({
                snackbarType: "error",
                snackbarMessage: `${item.title} is Out of Stock or Your Order Quantity is insufficent!`,
              })
            );
            setTimeout(() => {
              router.reload();
            }, 1000);
            return;
          }
        }

        const resData = await sendRequest({
          ignoreSnackbar: true,
          url: `/checkout`,
          method: "POST",
          body: {
            cart,
            email: auth.user.email,
            address: values.address,
            mobile: values.phoneNumber,
            total: totalPrice,
          },
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        localStorage.setItem("__temp__cart", JSON.stringify(cart));
        router.push(resData.sessionUrl);
      } else {
        dispatch(
          SET_SNACKBAR({
            snackbarType: "warning",
            snackbarMessage: "Please Login First!",
          })
        );
        router.push(`/login?redirect=cart`);
      }
    },
  });

  return (
    <>
      <Head>
        <title>Cart</title>
      </Head>

      {cart.length > 0 ? (
        <div style={{ marginTop: 32 }}>
          <Grid container spacing={mdUp ? 2 : 0}>
            <Grid item xs={12} md={8}>
              <Typography
                variant="h3"
                color="textSecondary"
                gutterBottom
                style={{ textAlign: !mdUp ? "center" : "" }}
              >
                SHOPPING CART
                <Divider />
              </Typography>
              <Container>
                {cart.map((item, index) => (
                  <CartItem
                    item={item}
                    index={index}
                    key={item._id}
                    removeHandler={() =>
                      removeFromCartHandler(dispatch, index, item.title)
                    }
                    increment={() => dispatch(INCREMENT({ index, cart }))}
                    decrement={() => dispatch(DECREMENT({ index, cart }))}
                  />
                ))}
              </Container>
            </Grid>
            <Grid item xs={12} md={4} style={{ marginTop: mdUp ? 0 : 16 }}>
              <Typography
                variant="h3"
                color="textSecondary"
                gutterBottom
                style={{ textAlign: !mdUp ? "center" : "" }}
              >
                SHIPPING
                <Divider />
              </Typography>
              <Container>
                <form onSubmit={formik.handleSubmit}>
                  <Grid container direction="column" spacing={4}>
                    <Grid item>
                      <Grid container direction="column" spacing={2}>
                        <Grid item>
                          <TextField
                            fullWidth
                            id="address"
                            name="address"
                            label="Address"
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.address &&
                              Boolean(formik.errors.address)
                            }
                            helperText={
                              formik.touched.address && formik.errors.address
                            }
                          />
                        </Grid>
                        <Grid item>
                          <TextField
                            fullWidth
                            id="phoneNumber"
                            name="phoneNumber"
                            label="Phone Number"
                            value={formik.values.phoneNumber}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.phoneNumber &&
                              Boolean(formik.errors.phoneNumber)
                            }
                            helperText={
                              formik.touched.phoneNumber &&
                              formik.errors.phoneNumber
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Grid container justifyContent="flex-end">
                        <Typography>
                          Total: <strong>${totalPrice}</strong>
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                      >
                        Proceed to Checkout
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Container>
            </Grid>
          </Grid>
        </div>
      ) : (
        // NO ITEMS IN CART
        <Grid
          container
          style={{ height: "calc(100vh - 60px)", position: "relative" }}
          alignItems="center"
          justifyContent="center"
          direction="column"
        >
          <img
            src="/emptyCart.svg"
            alt="empty cart"
            style={{ width: "100%", height: "100%" }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => router.push("/shop")}
            style={{ position: "absolute", top: 0, left: 0 }}
            startIcon={<KeyboardBackspace />}
          >
            back to shop
          </Button>
        </Grid>
      )}
    </>
  );
};

export default Cart;
