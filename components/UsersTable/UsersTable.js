import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {
  Avatar,
  Grid,
  IconButton,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useHttpClient } from "../../hooks/http-hook";
import { ADD_USERS_LIST } from "../../redux/users";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  container: {
    marginTop: 16,
  },
});

export default function BasicTable({ rows }) {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const classes = useStyles();
  const router = useRouter();
  const { token } = useSelector((state) => state.auth);
  const { sendRequest } = useHttpClient();
  const dispatch = useDispatch();

  const deleteHandler = async (id) => {
    await sendRequest({
      method: "DELETE",
      url: `/user/delete/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const newUsers = rows.filter((user) => user._id !== id);
    dispatch(ADD_USERS_LIST(newUsers));
    setSelectedUserId(null);
  };

  return (
    <TableContainer component={Paper} className={classes.container}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>ID</TableCell>
            <TableCell align="center">Avatar</TableCell>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Admin</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={row?._id}>
              <TableCell component="th" scope="row">
                {index + 1}
              </TableCell>
              <TableCell component="th" scope="row">
                {row._id}
              </TableCell>
              <TableCell align="center">
                <Grid container justifyContent="center">
                  <Avatar src={row?.avatar} />
                </Grid>
              </TableCell>
              <TableCell align="center">
                {row.firstName} {row?.lastName}
              </TableCell>
              <TableCell align="center">{row?.email}</TableCell>
              <TableCell align="center">
                {row.role === "admin" ? (
                  <>
                    <CheckIcon className="green-in-stock" />
                    {row.root && (
                      <PowerSettingsNewIcon className="green-in-stock" />
                    )}
                  </>
                ) : (
                  <ClearIcon color="secondary" />
                )}
              </TableCell>
              <TableCell align="center">
                <IconButton
                  onClick={() => router.push(`/users/${row?._id}`)}
                  disabled={row.root === true ? true : false}
                >
                  <EditIcon
                    color={row.root === true ? "disabled" : "primary"}
                  />
                </IconButton>
                <IconButton
                  onClick={() => setSelectedUserId(row?._id)}
                  disabled={row.root === true ? true : false}
                >
                  <DeleteIcon
                    color={row.root === true ? "disabled" : "secondary"}
                  />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog
        open={selectedUserId ? true : false}
        onClose={() => setSelectedUserId(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This user will be deleted permanently, are you sure about that ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => deleteHandler(selectedUserId)}
            color="secondary"
          >
            Delete
          </Button>
          <Button
            onClick={() => setSelectedUserId(null)}
            color="primary"
            autoFocus
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}
