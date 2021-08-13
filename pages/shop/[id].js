import { Button, Grid, Typography } from "@material-ui/core";
import { useMediaQuery, useTheme } from "@material-ui/core";
import axios from "../../axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCartHandler } from "../../utils/cartHandlers";
import Head from "next/head";

const ProductDetails = ({ data }) => {
  const { product } = data;
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [tab, setTab] = useState(0);
  const isActive = (index) => {
    if (index === tab) {
      return "image-active";
    }
  };

  return (
    <>
      <Head>
        <title>{product.title}</title>
      </Head>
      <div style={{ marginTop: 32 }}>
        <Grid container spacing={mdUp ? 2 : 0}>
          <Grid item md={8}>
            <img
              src={product.images[tab].url}
              alt={product.title}
              style={{
                objectFit: "cover",
                width: "100%",
                maxHeight: 500,
                objectPosition: "center",
              }}
            />
            <Grid container>
              {product.images.map((image, index) => (
                <Grid
                  item
                  xs={2}
                  style={{ marginRight: 3 }}
                  key={image.public_id}
                >
                  <img
                    className={isActive(index)}
                    src={image.url}
                    alt={product.title}
                    style={{
                      objectFit: "contain",
                      width: "100%",
                      cursor: "pointer",
                      maxHeight: 100,
                      objectFit: "contain",
                    }}
                    onClick={() => setTab(index)}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item md={4}>
            <Typography variant="h2">{product.title}</Typography>
            <Typography variant="h6" gutterBottom>
              <strong>${product.price}</strong>
            </Typography>
            <Grid container justifyContent="space-between">
              <Grid item>
                <Typography
                  style={{ color: product.inStock ? "#0BDA51" : "" }}
                  color={product.inStock > 0 ? "initial" : "secondary"}
                  variant="body1"
                  paragraph
                  gutterBottom
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  color="secondary"
                  variant="body1"
                  paragraph
                  gutterBottom
                >
                  Sold: <strong>{product.sold}</strong>
                </Typography>
              </Grid>
            </Grid>
            <Typography variant="body1" paragraph gutterBottom>
              {product.content}
            </Typography>

            <Grid item xs>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                disabled={product.inStock === 0}
                onClick={() => addToCartHandler(dispatch, product, cart)}
              >
                ADD TO CART
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default ProductDetails;

export const getServerSideProps = async (context) => {
  const id = context.params.id;
  let response;
  try {
    response = await axios.get(`/products/${id}`);
  } catch (error) {
    console.log(error);
  }
  return {
    props: { data: response.data },
  };
};
