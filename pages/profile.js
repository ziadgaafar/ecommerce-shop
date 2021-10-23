import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Divider,
  Grow,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { useEffect } from "react";
import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useRouter } from "next/router";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { SET_LOADING } from "../redux/loading";
import { UPDATE_USER } from "../redux/auth";
import { SET_SNACKBAR } from "../redux/snackbar";
import { ADD_ORDERS_LIST } from "../redux/orders";
import withAuth from "../hoc/withAuth";
import { useHttpClient } from "../hooks/http-hook";
import { imageUpload } from "../utils/imageUpload";
import OrdersTable from "../components/OrdersTable";

const schema = yup.object({
  firstName: yup.string().min(4, "Enter a Valid Name"),
  lastName: yup.string().min(4, "Enter a Valid Name"),
  newPassword: yup.string().min(8, "Your Password is too short!"),
  currentPassword: yup.string().required("Please Enter your Current Password"),
});

const Profile = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [showUpload, setShowUpload] = useState(false);
  const { user, token } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state);
  const { sendRequest } = useHttpClient();
  const [avatar, setAvatar] = useState();
  const router = useRouter();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: user?.email ? user.email : "",
      newPassword: "",
      currentPassword: "",
      firstName: user?.firstName ? user.firstName : "",
      lastName: user?.lastName ? user.lastName : "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      await sendRequest({
        url: "/user/update",
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          firstName: values.firstName,
          lastName: values.lastName,
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
      });
      dispatch(UPDATE_USER({ firstName: values.firstName }));
    },
  });

  const changeAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file)
      return dispatch(
        SET_SNACKBAR({
          snackbarType: "error",
          snackbarMessage: "File does not exists!",
        })
      );
    if (file.size > 1024 * 1024 /* 1mb */)
      return dispatch(
        SET_SNACKBAR({
          snackbarType: "error",
          snackbarMessage: "file is too large",
        })
      );
    if (file.type !== "image/jpeg" && file.type !== "image/png")
      return dispatch(
        SET_SNACKBAR({
          snackbarType: "error",
          snackbarMessage: "please select a valid image",
        })
      );
    setAvatar(file);
    dispatch(SET_LOADING(true));
    const imgArr = await imageUpload([file]);
    dispatch(SET_LOADING(false));

    await sendRequest({
      method: "PATCH",
      url: "/user/update/avatar",
      body: { avatar: imgArr[0].url },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(UPDATE_USER({ avatar: imgArr[0].url }));
  };

  useEffect(() => {
    (async () => {
      if (token) {
        // get orders for the logged in user or all orders if admin
        const resData = await sendRequest({
          ignoreSnackbar: true,
          url: "/orders",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(ADD_ORDERS_LIST(resData.orders));
      }
    })();
  }, [token]);

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      {user?.firstName && (
        <Box marginTop={2}>
          <Grid container justifyContent="center" spacing={mdUp ? 2 : 0}>
            {/* PROFILE */}
            <Grid item xs={8} md={4}>
              <Grid container alignItems="center" direction="column">
                <Grid item xs={12}>
                  <Typography variant="h4" color="textSecondary" gutterBottom>
                    {user.role === "user" ? "User Profile" : "Admin Profile"}
                    <Divider />
                  </Typography>
                </Grid>
                <Box
                  borderRadius="50%"
                  position="relative"
                  onMouseEnter={() => setShowUpload(true)}
                  onMouseLeave={() => setShowUpload(false)}
                >
                  <img
                    src={avatar ? URL.createObjectURL(avatar) : user.avatar}
                    alt={user.firstName}
                    style={{
                      borderRadius: "50%",
                      width: "100%",
                      height: 150,
                      width: 150,
                      height: 150,
                    }}
                  />

                  <Grow in={showUpload}>
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="center"
                      style={{
                        position: "absolute",
                        zIndex: 1,
                        width: "100%",
                        height: "100%",
                        backdropFilter: "blur(2px)",
                        top: 0,
                        borderRadius: "50%",
                      }}
                    >
                      <Button
                        component="label"
                        color="secondary"
                        variant="contained"
                      >
                        Change
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={changeAvatar}
                        />
                      </Button>
                    </Grid>
                  </Grow>
                </Box>
                <form onSubmit={formik.handleSubmit}>
                  <Grid container justifyContent="center" spacing={2}>
                    <Grid item xs={12} lg={8}>
                      <TextField
                        fullWidth
                        id="firstName"
                        name="firstName"
                        label="First Name"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.firstName &&
                          Boolean(formik.errors.firstName)
                        }
                        helperText={
                          formik.touched.firstName && formik.errors.firstName
                        }
                      />
                    </Grid>
                    <Grid item xs={12} lg={8}>
                      <TextField
                        fullWidth
                        id="lastName"
                        name="lastName"
                        label="Last Name"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.lastName &&
                          Boolean(formik.errors.lastName)
                        }
                        helperText={
                          formik.touched.lastName && formik.errors.lastName
                        }
                      />
                    </Grid>
                    <Grid item xs={12} lg={8}>
                      <TextField
                        fullWidth
                        id="email"
                        name="email"
                        label="Email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.email && Boolean(formik.errors.email)
                        }
                        helperText={formik.touched.email && formik.errors.email}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} lg={8}>
                      <TextField
                        fullWidth
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        label="New Password"
                        placeholder="(Unchanged)"
                        value={formik.values.newPassword}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.newPassword &&
                          Boolean(formik.errors.newPassword)
                        }
                        helperText={
                          formik.touched.newPassword &&
                          formik.errors.newPassword
                        }
                      />
                    </Grid>
                    <Grid item xs={12} lg={8}>
                      <TextField
                        fullWidth
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        label="Current Password"
                        value={formik.values.currentPassword}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.currentPassword &&
                          Boolean(formik.errors.currentPassword)
                        }
                        helperText={
                          formik.touched.currentPassword &&
                          formik.errors.currentPassword
                        }
                      />
                    </Grid>
                  </Grid>

                  <Grid container justifyContent="center">
                    <Box marginTop="16px">
                      <Button type="submit" variant="contained" color="primary">
                        UPDATE
                      </Button>
                    </Box>
                  </Grid>
                </form>
              </Grid>
            </Grid>
            {/* ORDERS */}
            <Grid item xs={8} md={8}>
              <Box marginTop={!mdUp ? "16px" : ""}>
                <Grid container justifyContent="center">
                  <Grid item xs={12}>
                    <Typography
                      align={!mdUp ? "center" : "left"}
                      variant="h4"
                      color="textSecondary"
                    >
                      Orders
                      <Divider />
                    </Typography>
                  </Grid>
                  {orders.length > 0 ? (
                    <OrdersTable rows={orders} />
                  ) : (
                    <Box padding={2}>
                      <Grid container alignItems="center" direction="column">
                        <Typography variant="h5" gutterBottom>
                          You have no orders!
                        </Typography>
                        <Button
                          color="secondary"
                          variant="contained"
                          onClick={() => router.push("/shop")}
                        >
                          Start Shopping
                        </Button>
                      </Grid>
                    </Box>
                  )}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default withAuth(Profile);
