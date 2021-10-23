import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { useHttpClient } from "../../hooks/http-hook";
import { ADD_ORDERS_LIST } from "../../redux/orders";
import Head from "next/head";

const OrderDetails = ({}) => {
  const router = useRouter();
  const { orders, auth } = useSelector((state) => state);
  const [orderDetails, setOrderDetails] = useState();
  const { sendRequest } = useHttpClient();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (auth.token) {
        // get orders for the logged in user or all orders if admin
        if (orders.length === 0) {
          const resData = await sendRequest({
            ignoreSnackbar: true,
            url: "/orders",
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          });
          dispatch(ADD_ORDERS_LIST(resData.orders));
        }
      }
    })();
  }, [auth.token]);

  useEffect(() => {
    if (orders) {
      const order = orders.find((order) => order._id === router.query.id);
      setOrderDetails(order);
    }
  }, [orders]);

  const deliverHandler = async () => {
    const data = await sendRequest({
      method: "PATCH",
      url: `/orders/${orderDetails._id}`,
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    setOrderDetails(data.order);
    const newOrders = orders.filter((order) => order._id !== data.order._id);
    newOrders.push(data.order);
    dispatch(ADD_ORDERS_LIST(newOrders));
  };

  return (
    <>
      <Button
        startIcon={<KeyboardBackspaceIcon />}
        variant="contained"
        color="primary"
        onClick={() => router.back()}
      >
        Go Back
      </Button>
      {orderDetails && (
        <>
          <Head>
            <title>Order Details</title>
          </Head>
          <Box marginTop={2}>
            <Container maxWidth="sm">
              <Typography variant="h5" gutterBottom paragraph>
                <strong>ORDER {orderDetails._id}</strong>
              </Typography>
              <Typography variant="h5" gutterBottom>
                SHIPPING
              </Typography>
              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <Typography color="textSecondary">
                    NAME: {orderDetails.user.firstName}{" "}
                    {orderDetails.user.lastName}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography color="textSecondary">
                    EMAIL: {orderDetails.user.email}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography color="textSecondary">
                    ADDRESS: {orderDetails.address}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography color="textSecondary">
                    MOBILE: {orderDetails.mobile}
                  </Typography>
                </Grid>
                <Grid item>
                  <Alert severity="success">
                    PAID ON {new Date(orderDetails.createdAt).toUTCString()}
                  </Alert>
                </Grid>
                <Grid item>
                  {orderDetails.delivered ? (
                    <Alert severity="success">
                      DELIVERED ON{" "}
                      {new Date(orderDetails.updatedAt).toUTCString()}
                    </Alert>
                  ) : (
                    <Grid container justifyContent="space-between">
                      <Grid item xs>
                        <Alert severity="error">NOT DELIVERED</Alert>
                      </Grid>

                      {auth.user?.role === "admin" && (
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={deliverHandler}
                        >
                          mark as delivered
                        </Button>
                      )}
                    </Grid>
                  )}
                </Grid>
              </Grid>
              <Box marginTop={2}>
                <Typography variant="h5" gutterBottom paragraph>
                  ORDER ITEMS
                </Typography>
                <Container>
                  {orderDetails.cart.map((item) => (
                    <div key={item._id}>
                      <Grid
                        key={item._id}
                        container
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={1}
                      >
                        <Grid item xs={2}>
                          <img
                            src={item.images[0].url}
                            alt={item.title}
                            style={{ objectFit: "cover", width: "100%" }}
                          />
                        </Grid>
                        <Grid item xs>
                          <Link href={`/shop/${item._id}`}>{item.title}</Link>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography>
                            <strong>
                              {item.quantity} X ${item.price} = $
                              {item.quantity * item.price}
                            </strong>
                          </Typography>
                        </Grid>
                      </Grid>
                      <Divider />
                    </div>
                  ))}
                </Container>
              </Box>
            </Container>
          </Box>
        </>
      )}
    </>
  );
};

export default OrderDetails;
