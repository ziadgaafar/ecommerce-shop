import {
  Button,
  Grid,
  TextField,
  Typography,
  Link as MaterialLink,
  Box,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import Link from "next/link";
import { useFormik } from "formik";
import * as yup from "yup";
import { useHttpClient } from "../hooks/http-hook";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LOGIN } from "../redux/auth";
import { useRouter } from "next/router";
import { ADD_TO_ORDERS_LIST } from "../redux/orders";
import { ADD_TO_USERS_LIST } from "../redux/users";
import { ADD_CATEGORIES_LIST } from "../redux/categories";
import Cookies from "js-cookie";
import Head from "next/head";

const schema = yup.object({
  email: yup
    .string("Enter your Email")
    .email("Enter a Correct Email!")
    .required("Email is required!"),
  password: yup
    .string("Enter your Password")
    .min(8, "Your Password is short!")
    .required("Password is required!"),
});

const Login = ({}) => {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const { token } = useSelector((state) => state.auth);
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { sendRequest } = useHttpClient();
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async (values) => {
      const responseData = await sendRequest({
        url: `/user/login`,
        method: "POST",
        body: values,
        headers: token && { Authorization: `Bearer ${token}` },
      });
      localStorage.setItem("firstLogin", true);
      Cookies.set("refreshToken", responseData.refreshToken, { expires: 7 });
      dispatch(
        LOGIN({ token: responseData.accessToken, user: responseData.user })
      );

      const resData = await sendRequest({
        ignoreSnackbar: true,
        url: "/orders",
        headers: {
          Authorization: `Bearer ${responseData.accessToken}`,
        },
      });
      dispatch(ADD_TO_ORDERS_LIST(resData.orders));

      if (responseData.user.role === "admin") {
        const data = await sendRequest({
          ignoreSnackbar: true,
          url: "/user/all",
          headers: {
            Authorization: `Bearer ${responseData.accessToken}`,
          },
        });
        dispatch(ADD_TO_USERS_LIST(data.users));
        const categoriesData = await sendRequest({
          ignoreSnackbar: true,
          url: "/categories",
          headers: {
            Authorization: `Bearer ${responseData.accessToken}`,
          },
        });
        dispatch(ADD_CATEGORIES_LIST(categoriesData.categories));
      }

      if (router.query.redirect) {
        router.push(`${router.query.redirect}`);
      } else {
        router.push("/shop");
      }
      setDisabled(true);
    },
  });

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        spacing={2}
        style={{
          height: `calc(100vh - 60px)`,
          width: "100%",
          position: "relative",
        }}
      >
        {!mdUp && (
          <img
            src="login.svg"
            alt="login shop"
            style={{
              position: "absolute",
              width: "100%",
              opacity: 0.3,
              zIndex: -1,
            }}
          />
        )}
        <Grid item xs={12} md={6}>
          <form onSubmit={formik.handleSubmit}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Grid container justifyContent="center">
                  <Grid item xs={8}>
                    <TextField
                      variant="outlined"
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
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container justifyContent="center">
                  <Grid item xs={8}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="password"
                      name="password"
                      label="Password"
                      type="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.password &&
                        Boolean(formik.errors.password)
                      }
                      helperText={
                        formik.touched.password && formik.errors.password
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container justifyContent="center">
                  <Grid item xs={8}>
                    <Box marginTop={1}>
                      <Button
                        fullWidth
                        color="primary"
                        variant="contained"
                        type="submit"
                        disabled={disabled}
                      >
                        LOGIN
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <Grid item>
              <Typography>Don't have an account ?</Typography>
            </Grid>
            <Grid item>
              <Link href="/register">
                <MaterialLink underline="hover" color="secondary">
                  Register Now
                </MaterialLink>
              </Link>
            </Grid>
          </Grid>
        </Grid>
        {mdUp && (
          <Grid item xs={12} md={6}>
            <img style={{ width: "100%" }} src="/login.svg" alt="shop login" />
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default Login;
