import { Divider, Grid, Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import withAuth from "../../hoc/withAuth";
import UsersTable from "../../components/UsersTable";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { SET_SNACKBAR } from "../../redux/snackbar";
import Head from "next/head";
import { useHttpClient } from "../../hooks/http-hook";
import { ADD_USERS_LIST } from "../../redux/users";
import { getUsers } from "../../utils/fetchDataHandlers";

const Users = ({}) => {
  const { users, auth } = useSelector((state) => state);
  const router = useRouter();
  const dispatch = useDispatch();
  const { sendRequest } = useHttpClient();

  useEffect(() => {
    if (auth.token && auth?.user?.role !== "admin") {
      dispatch(
        SET_SNACKBAR({
          snackbarType: "warning",
          snackbarMessage: `You're Not Authorized`,
        })
      );
      return router.push("/profile");
    }

    (async () => {
      //get all users
      if (auth.token) {
        const data = await getUsers(sendRequest, auth.token);
        dispatch(ADD_USERS_LIST(data.users));
      }
    })();
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
