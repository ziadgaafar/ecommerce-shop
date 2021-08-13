import { Button, useTheme, Box, Grid, Typography } from "@material-ui/core";
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
          height: `calc(100vh - ${mdUp ? "60" : "64"}px)`,
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
              <Typography
                variant={mdUp ? "h3" : "h2"}
                style={{ fontWeight: 400 }}
              >
                E-commerce
              </Typography>
              <Typography variant="h4" gutterBottom>
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

        <div className="custom-shape-divider-bottom-1628867198">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              className="shape-fill"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              className="shape-fill"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
      </Grid>
    </>
  );
}
