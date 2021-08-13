import { Grid, Link as MaterialLink } from "@material-ui/core";
import Link from "next/link";

const links = [
  { href: "/", label: "HOME" },
  { href: "/shop", label: "SHOP" },
];

const NavLinks = ({ handleClose, isLoggedIn, backdrop }) => {
  return (
    <>
      {links.map((link) => (
        <Grid item key={link.href}>
          <Link href={link.href}>
            <MaterialLink
              underline="none"
              color="inherit"
              onClick={handleClose}
            >
              {link.label}
            </MaterialLink>
          </Link>
        </Grid>
      ))}
      {!isLoggedIn && backdrop && (
        <Grid item>
          <Link href="/login">
            <MaterialLink
              underline="none"
              color="inherit"
              onClick={handleClose}
            >
              LOGIN
            </MaterialLink>
          </Link>
        </Grid>
      )}
    </>
  );
};

export default NavLinks;
