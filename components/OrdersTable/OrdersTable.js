import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import InfoIcon from "@material-ui/icons/Info";
import { useRouter } from "next/router";
import { IconButton } from "@material-ui/core";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  container: {
    marginTop: 16,
  },
});

export default function BasicTable({ rows }) {
  const classes = useStyles();
  const router = useRouter();

  return (
    <TableContainer component={Paper} className={classes.container}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="center">DATE</TableCell>
            <TableCell align="center">TOTAL</TableCell>
            <TableCell align="center">DELIVERED</TableCell>
            <TableCell align="center">ACTION</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row._id}>
              <TableCell component="th" scope="row">
                {row._id}
              </TableCell>
              <TableCell align="center">
                {new Date(row.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell align="center">${row.total}</TableCell>
              <TableCell align="center">
                {row.delivered ? (
                  <CheckIcon className="green-in-stock" />
                ) : (
                  <ClearIcon color="secondary" />
                )}
              </TableCell>
              <TableCell align="center">
                <IconButton onClick={() => router.push(`/orders/${row._id}`)}>
                  <InfoIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
