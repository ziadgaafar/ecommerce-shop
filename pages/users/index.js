import { Divider, Grid, Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import withAuth from "../../hoc/withAuth";
import UsersTable from "../../components/UsersTable";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { SET_SNACKBAR } from "../../redux/snackbar";
import Head from "next/head";

const Users = ({}) => {
  const { users, auth } = useSelector((state) => state);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.token && auth?.user?.role !== "admin") {
      dispatch(
        SET_SNACKBAR({
          snackbarType: "warning",
          snackbarMessage: `You're Not Authorized`,
        })
      );
      router.push("/profile");
    }
  }, [auth.token]);

  return (
    <>
      <Head>
        <title>Users Manager</title>
      </Head>
      {auth?.user?.role === "admin" && (
        <Grid container>
          <Grid container justifyContent="center">
            <Typography variant="h3" gutterBottom>
              Users
              <Divider />
            </Typography>
          </Grid>
          <UsersTable rows={users} />
        </Grid>
      )}
    </>
  );
};

export default withAuth(Users);
