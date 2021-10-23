import { Button, Container, Grid, Switch, TextField } from "@material-ui/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHttpClient } from "../../hooks/http-hook";
import { ADD_USERS_LIST } from "../../redux/users";
import Head from "next/head";

const UserDetails = ({}) => {
  const { sendRequest } = useHttpClient();
  const router = useRouter();
  const dispatch = useDispatch();
  const { auth, users } = useSelector((state) => state);
  const user = users.find((user) => user._id === router.query.id);
  const [isAdmin, setIsAdmin] = useState(user?.role === "admin" ? true : false);

  useEffect(() => {
    setIsAdmin(
      users.find((user) => user._id === router.query.id)?.role === "admin"
        ? true
        : false
    );
  }, [users]);

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
        if (users.length === 0) {
          const data = await sendRequest({
            ignoreSnackbar: true,
            url: "/user/all",
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          });
          dispatch(ADD_USERS_LIST(data.users));
        }
      }
    })();
  }, [auth.token]);

  const handleUpdate = async () => {
    const resData = await sendRequest({
      method: "PATCH",
      url: `/user/update/role/${router.query.id}`,
      body: { isAdmin },
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    const newUsers = users.filter((user) => user._id !== resData.user._id);
    dispatch(ADD_USERS_LIST([...newUsers, resData.user]));
  };

  return (
    <>
      <Head>
        <title>User Details</title>
      </Head>
      {user?.firstName && (
        <Container maxWidth="xs">
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Grid container justifyContent="center">
                <img
                  src={user?.avatar}
                  alt={user?.firstName}
                  style={{ width: 150, height: 150, borderRadius: "50%" }}
                />
              </Grid>
            </Grid>

            <Grid item>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    label="First Name"
                    value={user?.firstName ? user.firstName : ""}
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Last Name"
                    value={user?.lastName ? user.lastName : ""}
                    disabled
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container justifyContent="center" spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Email"
                    value={user?.email ? user.email : ""}
                    disabled
                  />
                </Grid>

                <Grid item xs={12}>
                  <Grid container justifyContent="center" alignItems="center">
                    Admin
                    <Switch
                      checked={isAdmin}
                      onChange={() => setIsAdmin((prev) => !prev)}
                      name="Admin"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container justifyContent="center">
                <Button
                  onClick={handleUpdate}
                  color="primary"
                  variant="contained"
                >
                  UPDATE
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  );
};

export default UserDetails;
