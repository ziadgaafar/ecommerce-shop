import { useMediaQuery } from "@material-ui/core";
import {
  Button,
  Divider,
  Grid,
  IconButton,
  Typography,
  useTheme,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

const CartItem = ({ item, removeHandler, increment, decrement }) => {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <div style={{ marginBottom: 16 }}>
      <Grid container justifyContent="space-between">
        <Grid item xs={6}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <img
                src={item.images[0].url}
                alt={item.title}
                style={{ width: "100%", objectFit: "cover", height: 100 }}
              />
            </Grid>
            <Grid item xs>
              <Grid
                container
                direction="column"
                justifyContent="space-around"
                style={{ height: "100%" }}
              >
                <Grid item>{item.title}</Grid>
                <Grid item>
                  <strong>${item.price}</strong>
                </Grid>
                <Grid item>
                  {item.inStock > 0 ? (
                    <Typography className="green-in-stock">
                      In Stock: <strong>{item.inStock}</strong>
                    </Typography>
                  ) : (
                    <Typography color="secondary"> Out Of OFStock</Typography>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid
            container
            alignItems="center"
            style={{ height: "100%" }}
            justifyContent="space-between"
          >
            <Grid item xs>
              <Grid
                container
                spacing={mdUp ? 1 : 0}
                alignItems="center"
                justifyContent="flex-end"
                direction={mdUp ? "row" : "column"}
              >
                <Grid item>
                  <Button
                    variant="outlined"
                    onClick={decrement}
                    disabled={item.quantity === 1}
                    color="primary"
                  >
                    -
                  </Button>
                </Grid>
                <Grid item>
                  <Typography>{item.quantity}</Typography>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    onClick={increment}
                    disabled={item.quantity === item.inStock}
                    color="primary"
                  >
                    +
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <IconButton onClick={removeHandler}>
                <DeleteIcon fontSize="large" color="secondary" />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Divider />
    </div>
  );
};

export default CartItem;
