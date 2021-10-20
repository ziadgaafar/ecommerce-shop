import { Button, useTheme, Grid, Typography } from "@material-ui/core";
import { useMediaQuery } from "@material-ui/core";
import { useRouter } from "next/router";
import Head from "next/head";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.6,
      staggerChildren: 0.2,
    },
  },
};

const leftItem = {
  hidden: { x: -200, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      ease: "easeOut",
      duration: 1,
    },
  },
};

const item = {
  hidden: { x: 200, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      ease: "easeOut",
      duration: 0.6,
    },
  },
};

export default function Home() {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const router = useRouter();
  return (
    <>
      <Head>
        <title>eCommerce Shop</title>
      </Head>
      <Grid
        container
        component={motion.div}
        variants={container}
        initial="hidden"
        animate="visible"
        justifyContent="center"
        style={{
          position: "relative",
          height: `calc(100vh - 64px)`,
          backgroundImage: mdUp && `url("blob-scene-haikei.svg")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        {!mdUp && (
          <img
            src="undraw_Online_shopping_re_k1sv.svg"
            alt="shop"
            style={{
              position: "absolute",
              width: "100%",
              opacity: 0.3,
              zIndex: -1,
              top: "20%",
            }}
          />
        )}
        {mdUp && (
          <Grid item md={8} component={motion.div} variants={leftItem}>
            <img
              src="undraw_Online_shopping_re_k1sv.svg"
              alt="landing"
              style={{ width: "95%" }}
            />
          </Grid>
        )}
        <Grid item xs={12} md={4} component={motion.div} variants={item}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            style={{ height: "70%" }}
          >
            <Grid item>
              <Typography variant="h3" style={{ fontWeight: 500 }}>
                eCommerce
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
