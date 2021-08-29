import { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  Grid,
  Typography,
  Button,
  Grow,
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Checkbox,
  Box,
} from "@material-ui/core";
import { AddShoppingCart } from "@material-ui/icons";
import { addToCartHandler } from "../../utils/cartHandlers";
import { useHttpClient } from "../../hooks/http-hook";
import Carousel from "react-material-ui-carousel";
import image from "next/image";

const Product = ({ product, handleSelect, selectedIds }) => {
  const cart = useSelector((state) => state.cart);
  const { user, token } = useSelector((state) => state.auth);
  const [grow, setGrow] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const { sendRequest } = useHttpClient();

  const handleView = () => {
    router.push(`/shop/${product._id}`);
  };

  const handleDelete = async (id) => {
    const resData = await sendRequest({
      method: "DELETE",
      url: `/products/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (resData) {
      router.reload();
    }
    setSelectedId(null);
  };

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (selectedIds.includes(product._id)) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [selectedIds]);

  return (
    <>
      <Grid
        container
        justifyContent="space-between"
        direction="column"
        style={{ minHeight: 310, position: "relative" }}
      >
        {user?.role === "admin" && (
          <Checkbox
            checked={checked}
            onChange={(e) => {
              setChecked(e.target.checked);
              handleSelect(product._id, e.target.checked);
            }}
            style={{
              position: "absolute",
              zIndex: 2,
              top: 0,
              left: 0,
              background: "white",
              borderRadius: 0,
            }}
          />
        )}
        <Grid item>
          {/* Image */}
          <Grid
            container
            justifyContent="center"
            style={{ position: "relative" }}
            onMouseEnter={() => setGrow(true)}
            onMouseLeave={() => setGrow(false)}
          >
            <Carousel navButtonsAlwaysInvisible>
              {product.images.map((image, index) => (
                <Image
                  key={image.public_id}
                  src={image.url}
                  alt={image.public_id}
                  width={500}
                  height={400}
                  objectFit="cover"
                  objectPosition="center"
                />
              ))}
            </Carousel>

            <Grow in={grow}>
              <Grid
                container
                alignItems="center"
                justifyContent="center"
                style={{
                  position: "absolute",
                  zIndex: 1,
                  width: "100%",
                  height: "87%",
                  backdropFilter: "blur(2px)",
                }}
              >
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleView}
                >
                  View
                </Button>
              </Grid>
            </Grow>
          </Grid>
          {/* Name, Category and Price */}
          <Grid container alignItems="center">
            {/* Name and Category */}
            <Grid item xs>
              <Grid container direction="column">
                <Grid item>
                  <Typography
                    gutterBottom
                    style={{
                      lineHeight: "1.5rem",
                      maxHeight: "3rem",
                      overflow: "hidden",
                    }}
                  >
                    {product.title}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                    gutterBottom
                  >
                    {product.category.name.toUpperCase()}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {/* Price */}

            <Grid item>
              <Grid container direction="column" alignItems="flex-end">
                <Typography>${product.price}</Typography>
                {product.inStock > 0 ? (
                  <Typography style={{ color: "#0BDA51" }}>In Stock</Typography>
                ) : (
                  <Typography color="error">Out of Stock</Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          {/* Rating and Add to Cart Icon */}
          <Grid container justifyContent="center">
            <Button
              fullWidth
              disabled={product.inStock === 0}
              onClick={() => addToCartHandler(dispatch, product, cart)}
              endIcon={<AddShoppingCart />}
              variant="contained"
            >
              add to cart
            </Button>
          </Grid>
        </Grid>
        {user?.role === "admin" && (
          <Grid item>
            <Grid container>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => router.push(`/products/edit/${product._id}`)}
                >
                  Edit
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={() => setSelectedId(product._id)}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )}
        <Dialog
          open={selectedId ? true : false}
          onClose={() => setSelectedId(null)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This product will be deleted permanently, are you sure about that
              ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleDelete(selectedId)} color="secondary">
              Delete
            </Button>
            <Button
              onClick={() => setSelectedId(null)}
              color="primary"
              autoFocus
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </>
  );
};

export default Product;
