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
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Head from "next/head";
import { loginHandler } from "../utils/fetchDataHandlers";

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
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { sendRequest } = useHttpClient();
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: (values) => {
      setDisabled(true);
      loginHandler(values, dispatch, sendRequest, setDisabled, router);
    },
  });

  const demoLogin = (asAdmin = false) => {
    const user = {
      email: `${asAdmin ? "admin" : "john"}doe@email.com`,
      password: `12345678`,
    };
    setDisabled(true);
    loginHandler(user, dispatch, sendRequest, setDisabled, router);
  };

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
                    <Box marginTop={1}>
                      <Button
                        fullWidth
                        color="primary"
                        variant="contained"
                        disabled={disabled}
                        onClick={() => demoLogin()}
                      >
                        DEMO LOGIN
                      </Button>
                    </Box>
                    <Box marginTop={1}>
                      <Button
                        fullWidth
                        color="primary"
                        variant="contained"
                        disabled={disabled}
                        onClick={() => demoLogin(true)}
                      >
                        DEMO LOGIN AS ADMIN
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
