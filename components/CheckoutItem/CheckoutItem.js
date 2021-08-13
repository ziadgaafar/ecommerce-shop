import { Box, Divider, Grid, Typography } from "@material-ui/core";

const CheckoutItem = ({ title, image, price, category, quantity }) => {
  return (
    <Box padding="16px 0">
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs={8}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={6} md={4}>
              <img
                style={{ width: "100%", borderRadius: 6 }}
                src={image}
                alt={title}
              />
            </Grid>
            <Grid item>
              <Typography>{title}</Typography>
              <Typography color="textSecondary" noWrap>
                {category}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid container justifyContent="space-between">
            <Grid item>Qty {quantity}</Grid>
            <Grid item>${price}</Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CheckoutItem;
