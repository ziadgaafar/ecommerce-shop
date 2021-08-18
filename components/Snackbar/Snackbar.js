import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { SET_SNACKBAR } from "../../redux/snackbar";
import { Slide } from "@material-ui/core";
import { useMediaQuery } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function CustomizedSnackbars() {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const classes = useStyles();
  const { snackbarOpen, snackbarMessage, snackbarType } = useSelector(
    (state) => state.snackbar
  );
  const dispatch = useDispatch();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch(
      SET_SNACKBAR({
        snackbarOpen: false,
        snackbarMessage,
        snackbarType,
      })
    );
  };

  return (
    <div className={classes.root}>
      <Snackbar
        key={snackbarMessage}
        disableWindowBlurListener
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleClose}
        TransitionComponent={Slide}
        anchorOrigin={{
          horizontal: mdUp ? "right" : "center",
          vertical: "top",
        }}
        style={{ top: 60 }}
      >
        <Alert onClose={handleClose} severity={snackbarType}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
