import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Typography,
  Grid,
  useTheme,
} from "@material-ui/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHttpClient } from "../hooks/http-hook";
import { ADD_CART } from "../redux/cart";
import withAuth from "../hoc/withAuth";
import { useMediaQuery } from "@material-ui/core";
import CheckoutItem from "../components/CheckoutItem";
import { ADD_TO_ORDERS_LIST } from "../redux/orders";
import Head from "next/head";

const Checkout = ({ session_id }) => {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const { sendRequest } = useHttpClient();
  const { token, user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state);
  const [sessionData, setSessionData] = useState();
  const [tempCart, setTempCart] = useState([]);
  const [info, setInfo] = useState([]);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      const fetch = async () => {
        const resData = await sendRequest({
          ignoreSnackbar: true,
          url: `/checkout/session?session_id=${session_id}`,
          body: { session_id },
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resData) {
          const newData = {
            address: resData.metadata.address,
            mobile: resData.metadata.mobile,
            total: resData.metadata.total,
            cart,
          };

          setSessionData(resData);
          const infoArr = [
            { label: "Order Date", value: new Date().toDateString() },
            { label: "Email", value: user?.email },
            { label: "Mobile", value: resData.metadata.mobile },
            { label: "Address", value: resData.metadata.address },
          ];
          setInfo(infoArr);

          setTempCart(JSON.parse(localStorage.getItem("__temp__cart")));
          dispatch(ADD_CART([]));
          router.replace(`${router.pathname}?session_id=expired`);

          const orderResData = await sendRequest({
            ignoreSnackbar: true,
            url: `/orders`,
            method: "POST",
            body: newData,
            headers: { Authorization: `Bearer ${token}` },
          });
          dispatch(ADD_TO_ORDERS_LIST([orderResData]));
        } else {
          router.push("/profile");
        }
      };
      fetch();
    }
  }, [token]);

  return (
    <>
      <Head>
        <title>Checkout - Order Placed</title>
      </Head>
      {sessionData && (
        <>
          <Container maxWidth="md">
            <Paper>
              <Box padding="16px">
                <Typography
                  variant="h3"
                  gutterBottom
                  paragraph
                  align={!mdUp ? "center" : "left"}
                >
                  Order Placed
                </Typography>
                <Typography gutterBottom>
                  <strong>Hi {user?.firstName},</strong>
                </Typography>
                <Typography paragraph gutterBottom>
                  Your order has been confirmed and will be shipping soon.
                </Typography>
                {/* DIVIDER */}
                <Divider />
                {/* DIVIDER */}
                <Box padding="16px 0">
                  <Grid container justifyContent="space-between">
                    {info.map((item) => (
                      <Grid item key={item.value} xs={!mdUp && 6}>
                        <Typography color="textSecondary">
                          {item.label}
                        </Typography>
                        <Typography noWrap>{item.value}</Typography>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                {/* DIVIDER */}
                <Divider />
                {/* DIVIDER */}
                {tempCart.length > 0 &&
                  tempCart.map((item) => (
                    <CheckoutItem
                      key={item._id}
                      title={item.title}
                      image={item.images[0].url}
                      category={item.category.name}
                      quantity={item.quantity}
                      price={item.quantity * item.price}
                    />
                  ))}
                {/* DIVIDER */}
                <Divider />
                {/* DIVIDER */}
                <Box padding="16px 0">
                  <Grid container direction="column" spacing={2}>
                    <Grid item>
                      <Grid container justifyContent="space-between">
                        <Grid item>Subtotal</Grid>
                        <Grid item>
                          <strong>${sessionData.metadata.total}</strong>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Grid container justifyContent="space-between">
                        <Grid item>Shipping</Grid>
                        <Grid item>
                          <strong>$0</strong>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Grid container justifyContent="space-between">
                        <Grid item>Fees</Grid>
                        <Grid item>
                          <strong>$0</strong>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
                {/* DIVIDER */}
                <Divider />
                {/* DIVIDER */}
                <Box padding="16px 0">
                  <Grid container justifyContent="space-between">
                    <Grid item>Subtotal</Grid>
                    <Grid item>
                      <strong>${sessionData.metadata.total}</strong>
                    </Grid>
                  </Grid>
                </Box>
                {/* DIVIDER */}
                <Divider />
                {/* DIVIDER */}
                <Box padding="16px 0">
                  <Typography paragraph gutterBottom>
                    We'll send you shipping confirmation when your item(s) are
                    on the way! We appreciate your business, and hope you enjoy
                    your purchase.
                  </Typography>
                  <Typography>Thank you!</Typography>
                </Box>
              </Box>
            </Paper>
          </Container>
        </>
      )}
    </>
  );
};

export default withAuth(Checkout);

export const getServerSideProps = async (context) => {
  const { session_id } = context.query;

  if (!session_id) {
    return {
      redirect: {
        destination: "/cart",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session_id,
    },
  };
};
