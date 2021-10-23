import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { useHttpClient } from "../hooks/http-hook";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  ADD_CATEGORIES_LIST,
  ADD_TO_CATEGORIES_LIST,
} from "../redux/categories";
import { useState } from "react";
import withAuth from "../hoc/withAuth";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { SET_SNACKBAR } from "../redux/snackbar";
import Head from "next/head";
import { getCategories } from "../utils/fetchDataHandlers";

const schema = yup.object({
  categoryName: yup
    .string("Enter Category Name")
    .min(4, "Category Name is too short")
    .required("Category Name is required!"),
});

const Categories = ({}) => {
  const { auth, categories } = useSelector((state) => state);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedCategoryIdUpdate, setSelectedCategoryIdUpdate] = useState(
    null
  );
  const { sendRequest } = useHttpClient();
  const dispatch = useDispatch();
  const router = useRouter();
  const formik = useFormik({
    initialValues: { categoryName: "" },
    validationSchema: schema,
    onSubmit: async (values) => {
      if (selectedCategoryIdUpdate) {
        await handleUpdate(selectedCategoryIdUpdate, values.categoryName);
      } else {
        await handleCreate(values.categoryName);
      }
    },
  });

  const handleDelete = async (id) => {
    await sendRequest({
      method: "DELETE",
      url: `/categories/${id}`,
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    const newCategories = categories.filter((c) => c._id !== id);
    dispatch(ADD_CATEGORIES_LIST(newCategories));
    setSelectedCategoryId(null);
  };

  const handleCreate = async (name) => {
    const resdata = await sendRequest({
      method: "POST",
      url: `/categories`,
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
      body: {
        name,
      },
    });
    dispatch(ADD_TO_CATEGORIES_LIST([resdata.category]));
  };

  const handleUpdate = async (id, name) => {
    const resdata = await sendRequest({
      method: "PATCH",
      url: `/categories/${id}`,
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
      body: {
        name,
      },
    });
    const newCategories = categories.filter((c) => c._id !== id);
    newCategories.push(resdata.updatedCategory);
    dispatch(ADD_CATEGORIES_LIST(newCategories));
    setSelectedCategoryIdUpdate(null);
  };

  useEffect(() => {
    if (auth.token && auth.user.role !== "admin") {
      dispatch(
        SET_SNACKBAR({
          snackbarType: "error",
          snackbarMessage: `You're not authorized!`,
        })
      );
      return router.push("/profile");
    }

    (async () => {
      if (auth.token) {
        // get categories
        const categoriesData = await getCategories(sendRequest, auth.token);
        dispatch(ADD_CATEGORIES_LIST(categoriesData.categories));
      }
    })();
  }, [auth.token]);

  return (
    <>
      <Head>
        <title>Categories</title>
      </Head>
      {auth?.user?.role === "admin" && (
        <Box marginTop={2}>
          <Container maxWidth="sm">
            <form onSubmit={formik.handleSubmit}>
              <Grid container>
                <Grid item xs>
                  <TextField
                    id="categoryName"
                    name="categoryName"
                    label="Category Name"
                    value={formik.values.categoryName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.categoryName &&
                      Boolean(formik.errors.categoryName)
                    }
                    helperText={
                      formik.touched.categoryName && formik.errors.categoryName
                    }
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item>
                  <Button
                    type="submit"
                    variant="outlined"
                    color="primary"
                    style={{ height: 56 }}
                  >
                    Create
                  </Button>
                </Grid>
              </Grid>
            </form>
            <Box marginTop={2}>
              {categories?.map((c) => (
                <Paper key={c._id}>
                  <Box padding={4}>
                    <Grid
                      container
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography>{c.name}</Typography>
                      <Grid item>
                        <Grid container>
                          <IconButton
                            onClick={() => setSelectedCategoryIdUpdate(c._id)}
                          >
                            <EditIcon color="primary" />
                          </IconButton>
                          <IconButton
                            onClick={() => setSelectedCategoryId(c._id)}
                          >
                            <DeleteIcon color="secondary" />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Container>
          <Dialog
            open={selectedCategoryId ? true : false}
            onClose={() => setSelectedCategoryId(null)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                This Category will be deleted permanently,{" "}
                <Typography color="error" display="inline">
                  <strong>
                    All related products will be permanently deleted!
                  </strong>
                </Typography>{" "}
                are you sure about that ?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => handleDelete(selectedCategoryId)}
                color="secondary"
              >
                Delete
              </Button>
              <Button
                onClick={() => setSelectedCategoryId(null)}
                color="primary"
                autoFocus
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={selectedCategoryIdUpdate ? true : false}
            onClose={() => setSelectedCategoryIdUpdate(null)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <form onSubmit={formik.handleSubmit}>
              <DialogTitle id="alert-dialog-title">Confirm Update</DialogTitle>
              <DialogContent>
                <TextField
                  id="categoryName"
                  name="categoryName"
                  label="Category Name"
                  value={formik.values.categoryName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.categoryName &&
                    Boolean(formik.errors.categoryName)
                  }
                  helperText={
                    formik.touched.categoryName && formik.errors.categoryName
                  }
                  fullWidth
                  variant="outlined"
                />
                <DialogContentText id="alert-dialog-description">
                  This Category will be Updated, are you sure about that ?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button type="submit" color="primary">
                  Update
                </Button>
                <Button
                  onClick={() => setSelectedCategoryIdUpdate(null)}
                  color="secondary"
                  autoFocus
                >
                  Cancel
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        </Box>
      )}
    </>
  );
};

export default withAuth(Categories);
