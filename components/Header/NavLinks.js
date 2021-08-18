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
            <a onClick={handleClose}>{link.label}</a>
          </Link>
        </Grid>
      ))}
      {!isLoggedIn && backdrop && (
        <Grid item>
          <Link href="/login">
            <a onClick={handleClose}>LOGIN</a>
          </Link>
        </Grid>
      )}
    </>
  );
};

export default NavLinks;
