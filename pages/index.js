import { Button, useTheme, Grid, Typography } from "@material-ui/core";
import { useMediaQuery } from "@material-ui/core";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Home() {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const router = useRouter();
  return (
    <>
      <Head>
        <title>E-commerce Shop</title>
      </Head>
      <Grid
        container
        justifyContent="center"
        style={{
          position: "relative",
          height: `calc(100vh - 64px)`,
          backgroundImage: mdUp && `url("layered-steps-haikei.svg")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        {!mdUp && (
          <img
            src="landing.png"
            alt="shop"
            style={{
              position: "absolute",
              width: "100%",
              opacity: 0.3,
              zIndex: -1,
              top: 20,
            }}
          />
        )}
        {mdUp && (
          <Grid item md={8}>
            <img src="landing.png" alt="landing" style={{ width: "100%" }} />
          </Grid>
        )}
        <Grid item xs={12} md={4}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            style={{ height: "70%" }}
          >
            <Grid item>
              <Typography variant="h3" style={{ fontWeight: 400 }}>
                E-commerce
              </Typography>
              <Typography variant="h5" color="textSecondary" gutterBottom>
                Landing Page
              </Typography>
              <Typography paragraph gutterBottom>
                Buying goods and products using internet
              </Typography>
              <Grid container justifyContent="center">
                <Button
                  fullWidth={mdUp}
                  variant="contained"
                  color="secondary"
                  style={{ borderRadius: "30px" }}
                  onClick={() => router.push("/shop")}
                >
                  SHOP NOW
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
