import {
  Container,
  Grid,
  Hidden,
  IconButton,
  Link as MaterialLink,
  Typography,
  Backdrop,
  Badge,
  Avatar,
  useTheme,
  AppBar,
  Toolbar,
} from "@material-ui/core";
import Link from "next/link";
import classes from "./Header.module.css";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import StorefrontIcon from "@material-ui/icons/Storefront";
import { useEffect, useState } from "react";
import NavLinks from "./NavLinks";
import { useSelector } from "react-redux";
import Menu from "./Menu";
import { useRouter } from "next/router";
import { useMediaQuery } from "@material-ui/core";

const Header = ({}) => {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const router = useRouter();
  const cart = useSelector((state) => state.cart);
  const [open, setOpen] = useState(false);
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    mdUp && setOpen(false);
  }, [mdUp]);

  return (
    <>
      <Backdrop open={open} className={classes.backdrop}>
        <Container fixed style={{ color: "white" }}>
          <Grid
            container
            direction="column"
            spacing={8}
            className={classes.backdropNavlinksContainer}
          >
            <NavLinks
              isLoggedIn={!!token}
              backdrop
              handleClose={() => setOpen(false)}
            />
          </Grid>
        </Container>
      </Backdrop>
      <AppBar
        style={{
          backgroundColor: open ? "black" : "white",
          boxShadow: "none",
          color: "black",
        }}
      >
        <Container disableGutters fixed>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            className={classes.headerContainer}
            style={{
              backgroundColor: open ? "black" : "white",
            }}
          >
            <Grid item className={classes.logoContainer}>
              <StorefrontIcon
                style={{
                  color: "white",
                  width: "100%",
                  height: "100%",
                  cursor: "pointer",
                }}
                onClick={() => router.push("/")}
              />
            </Grid>
            <Hidden smDown>
              <Grid item xs>
                <Grid container spacing={2} style={{ marginLeft: "2em" }}>
                  <NavLinks />
                </Grid>
              </Grid>
            </Hidden>
            <Grid item>
              <Grid container alignItems="center">
                <Grid item>
                  <IconButton onClick={() => router.push("/cart")}>
                    <Badge badgeContent={cart.length} color="secondary">
                      <ShoppingCartIcon
                        style={{ color: open ? "white" : "black" }}
                        fontSize="large"
                      />
                    </Badge>
                  </IconButton>
                </Grid>
                {token && (
                  <Hidden mdUp>
                    <Grid item>
                      <Menu
                        firstName={user.firstName}
                        image={user.avatar}
                        header
                      />
                    </Grid>
                  </Hidden>
                )}
                <Grid item>
                  <Hidden mdUp>
                    {open ? (
                      <IconButton onClick={() => setOpen(false)}>
                        <CloseIcon
                          style={{ color: open ? "white" : "black" }}
                          fontSize="large"
                        />
                      </IconButton>
                    ) : (
                      <IconButton onClick={() => setOpen(true)}>
                        <MenuIcon
                          style={{ color: open ? "white" : "black" }}
                          fontSize="large"
                        />
                      </IconButton>
                    )}
                  </Hidden>
                  <Hidden smDown>
                    {token ? (
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>
                          <Avatar
                            alt={user.firstName}
                            src={user.avatar}
                            style={{ border: "1px solid black" }}
                          />
                        </Grid>
                        <Grid item>
                          <Menu firstName={user.firstName} />
                        </Grid>
                      </Grid>
                    ) : (
                      <Link href="/login">
                        <MaterialLink underline="none">LOGIN</MaterialLink>
                      </Link>
                    )}
                  </Hidden>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </AppBar>
    </>
  );
};

export default Header;
