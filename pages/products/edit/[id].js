import {
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { useHttpClient } from "../../../hooks/http-hook";
import { SET_LOADING } from "../../../redux/loading";
import { SET_SNACKBAR } from "../../../redux/snackbar";
import { imageUpload } from "../../../utils/imageUpload";
import withAuth from "../../../hoc/withAuth";
import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "../../../axios";
import Head from "next/head";

const schema = yup.object({
  title: yup
    .string()
    .required("Title is required!")
    .min(4, "Title if too short!"),
  price: yup
    .number()
    .required("Price is required!")
    .min(1, "Price is too low!")
    .max(10000, "Price is too high"),
  inStock: yup
    .number()
    .required("Price is required!")
    .min(10, "Stock is too low!")
    .max(10000, "Price is too high"),
  content: yup
    .string()
    .required("Content is required!")
    .min(20, "Content is too short!")
    .max(200),
  description: yup
    .string()
    .required("Description is required!")
    .min(20, "Content is too short!")
    .max(400),
  category: yup.string().required("Category is Required!"),
});

const EditProduct = ({ product }) => {
  const router = useRouter();
  const { categories, auth } = useSelector((state) => state);
  const { sendRequest } = useHttpClient();
  const theme = useTheme();
  const dispatch = useDispatch();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [imagesArr, setImagesArr] = useState(product.images);
  const formik = useFormik({
    initialValues: {
      title: product.title,
      price: product.price,
      inStock: product.inStock,
      content: product.content,
      description: product.description,
      category: categories.length > 0 ? product.category._id : "",
    },
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: (values) => {
      handleEdit(values);
    },
  });

  const handleEdit = async (values) => {
    if (imagesArr.length === 0) {
      return dispatch(
        SET_SNACKBAR({
          snackbarType: "error",
          snackbarMessage: "Please add at least one image!",
        })
      );
    }
    const alreadyUploadedImages = imagesArr.filter((image) => image.url);
    const notUploadedImages = imagesArr.filter((image) => !image.url);
    let uploadedImages = [];
    if (notUploadedImages.length > 0) {
      dispatch(SET_LOADING(true));
      uploadedImages = await imageUpload(notUploadedImages);
    }
    const newImagesArr = [...alreadyUploadedImages, ...uploadedImages];

    const resData = await sendRequest({
      method: "PATCH",
      url: `/products/${product._id}`,
      body: { ...values, images: newImagesArr },
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    if (resData) {
      router.push(`/shop/${product._id}`);
    }
  };

  const handleImagesUpload = async (e) => {
    const images = e.target.files;
    if (imagesArr.length + images.length > 5) {
      return dispatch(
        SET_SNACKBAR({
          snackbarType: "error",
          snackbarMessage: "You can upload maximum of 5 images!",
        })
      );
    }
    for (const image of images) {
      if (!image) {
        return dispatch(
          SET_SNACKBAR({
            snackbarType: "error",
            snackbarMessage: "File does not exists!",
          })
        );
      }
      if (image.size > 1024 * 1024 /* 1mb */) {
        return dispatch(
          SET_SNACKBAR({
            snackbarType: "error",
            snackbarMessage: "file is too large",
          })
        );
      }
      if (image.type !== "image/jpeg" && file.type !== "image/png") {
        return dispatch(
          SET_SNACKBAR({
            snackbarType: "error",
            snackbarMessage: "please select a valid image",
          })
        );
      }
      setImagesArr((prev) => [...prev, image]);
    }
  };

  const handleRemoveImage = (index) => {
    const newArr = [...imagesArr];
    newArr.splice(index, 1);
    setImagesArr(newArr);
  };

  useEffect(() => {
    if (auth.token && auth.user.role !== "admin") {
      dispatch(
        SET_SNACKBAR({
          snackbarType: "error",
          snackbarMessage: "Unauthorized!",
        })
      );
      router.push("/profile");
    }
  }, [auth.token]);

  return (
    <>
      <Head>
        <title>Edit Product</title>
      </Head>
      {auth?.user?.role === "admin" && (
        <form onSubmit={formik.handleSubmit}>
          <Grid container>
            <Grid item xs={12} md={6}>
              <Box padding={`0 ${mdUp ? "16px 0 0" : "16px"}`} marginTop={1}>
                <Grid container direction="column">
                  <Grid item style={{ marginBottom: 16 }}>
                    <TextField
                      name="title"
                      label="Title"
                      variant="outlined"
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.title && Boolean(formik.errors.title)
                      }
                      helperText={formik.touched.title && formik.errors.title}
                      fullWidth
                    />
                  </Grid>

                  <Grid item style={{ marginBottom: 16 }}>
                    <Grid container>
                      <Grid item xs={6}>
                        <TextField
                          name="price"
                          label="Price"
                          type="number"
                          variant="outlined"
                          InputProps={{ inputProps: { min: 0 } }}
                          value={formik.values.price}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.price && Boolean(formik.errors.price)
                          }
                          helperText={
                            formik.touched.price && formik.errors.price
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          name="inStock"
                          label="In Stock"
                          type="number"
                          variant="outlined"
                          InputProps={{ inputProps: { min: 0 } }}
                          value={formik.values.inStock}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.inStock &&
                            Boolean(formik.errors.inStock)
                          }
                          helperText={
                            formik.touched.inStock && formik.errors.inStock
                          }
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item style={{ marginBottom: 16 }}>
                    <TextField
                      name="content"
                      multiline
                      minRows={4}
                      maxRows={4}
                      label="Content"
                      variant="outlined"
                      value={formik.values.content}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.content && Boolean(formik.errors.content)
                      }
                      helperText={
                        formik.touched.content && formik.errors.content
                      }
                      fullWidth
                    />
                  </Grid>

                  <Grid item style={{ marginBottom: 16 }}>
                    <TextField
                      name="description"
                      multiline
                      minRows={6}
                      maxRows={6}
                      label="Description"
                      variant="outlined"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.description &&
                        Boolean(formik.errors.description)
                      }
                      helperText={
                        formik.touched.description && formik.errors.description
                      }
                      fullWidth
                    />
                  </Grid>

                  <Grid item>
                    <TextField
                      name="category"
                      select
                      label="Category"
                      variant="outlined"
                      color="primary"
                      value={formik.values.category}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.category &&
                        Boolean(formik.errors.category)
                      }
                      helperText={
                        formik.touched.category && formik.errors.category
                      }
                      fullWidth
                    >
                      {categories &&
                        categories.map((c) => (
                          <MenuItem key={c._id} value={c._id}>
                            {c.name}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box padding={mdUp ? "0" : "0 16px"} marginTop={1}>
                <Box marginTop={mdUp ? 0 : 2}>
                  <Button
                    fullWidth
                    component="label"
                    variant="contained"
                    color="secondary"
                  >
                    Upload Images
                    <input
                      type="file"
                      onChange={handleImagesUpload}
                      hidden
                      multiple
                      accept="image/*"
                    />
                  </Button>
                  <Box marginTop={2}>
                    <Grid container>
                      {imagesArr.length > 0 &&
                        imagesArr.map((image, index) => (
                          <Grid
                            item
                            xs={index === 0 ? 12 : 3}
                            key={image.public_id ? image.public_id : image.name}
                            style={{ position: "relative" }}
                          >
                            <img
                              src={
                                image.url
                                  ? image.url
                                  : URL.createObjectURL(image)
                              }
                              alt={image.name}
                              style={{
                                width: "100%",
                                height: index === 0 ? 350 : 80,
                                objectFit: "cover",
                                objectPosition: "center",
                                border: "1px solid grey",
                                padding: 2,
                                borderRadius: 6,
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveImage(index)}
                              style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                zIndex: 2,
                                background: "white",
                              }}
                            >
                              <Close fontSize="small" color="secondary" />
                            </IconButton>
                          </Grid>
                        ))}
                    </Grid>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid container justifyContent="center">
              <Box marginTop={2}>
                <Button type="submit" variant="contained" color="primary">
                  edit
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    </>
  );
};

export default withAuth(EditProduct);

export const getServerSideProps = async (context) => {
  const id = context.params.id;
  let response;
  try {
    response = await axios.get(`/products/${id}`);
  } catch (error) {
    console.log(error);
  }
  return {
    props: { product: response.data.product },
  };
};
