import {
  Button,
  Grid,
  TextField,
  Typography,
  Link as MaterialLink,
  FormControl,
  FormLabel,
  useTheme,
  useMediaQuery,
  Box,
} from "@material-ui/core";
import Link from "next/link";
import { useFormik } from "formik";
import * as yup from "yup";
import { useHttpClient } from "../hooks/http-hook";
import { useRouter } from "next/router";
import { useState } from "react";
import Head from "next/head";

const schema = yup.object({
  email: yup
    .string("Enter your Email")
    .email("Enter a Correct Email!")
    .required("Email is required!"),
  firstName: yup
    .string("Enter Your First Name")
    .min(4, "Enter a Valid name")
    .required("First Name is Required"),
  lastName: yup
    .string("Enter Your Last Name")
    .min(4, "Enter a Valid name")
    .required("Last Name is Required"),
  password: yup
    .string("Enter your Password")
    .min(8, "Your Password is short!")
    .required("Password is required!"),
  confirmPassword: yup
    .string("Enter your Password again")
    .required("This field is required!")
    .oneOf([yup.ref("password"), null], `Password does not match!`),
});

const Register = ({}) => {
  const [disabled, setDisabled] = useState(false);
  const { sendRequest } = useHttpClient();
  const router = useRouter();
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        await sendRequest({
          url: `/user/register`,
          method: "post",
          body: values,
        });
        router.push("/login");
        setDisabled(true);
      } catch (error) {}
    },
  });

  return (
    <>
      <Head>
        <title>Register</title>
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
            src="register.svg"
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
                <Grid container justifyContent="center" spacing={1}>
                  <Grid item xs={4}>
                    <TextField
                      variant="outlined"
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
                  <Grid item xs={4}>
                    <TextField
                      variant="outlined"
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
                    <TextField
                      fullWidth
                      variant="outlined"
                      id="confirmPassword"
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.confirmPassword &&
                        Boolean(formik.errors.confirmPassword)
                      }
                      helperText={
                        formik.touched.confirmPassword &&
                        formik.errors.confirmPassword
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
                        Register
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
              <Typography>Already have an account?</Typography>
            </Grid>
            <Grid item>
              <Link href="/login">
                <MaterialLink underline="hover" color="secondary">
                  Login Now
                </MaterialLink>
              </Link>
            </Grid>
          </Grid>
        </Grid>
        {mdUp && (
          <Grid item xs={12} md={6}>
            <img
              style={{ width: "100%" }}
              src="/register.svg"
              alt="shop login"
            />
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default Register;
