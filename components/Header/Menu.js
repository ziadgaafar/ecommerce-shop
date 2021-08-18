import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Divider, IconButton } from "@material-ui/core";
import { useRouter } from "next/router";
import { ExpandMore } from "@material-ui/icons";
import { useHttpClient } from "../../hooks/http-hook";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT } from "../../redux/auth";
import { REMOVE_ORDERS_LIST } from "../../redux/orders";
import { REMOVE_USERS_LIST } from "../../redux/users";
import { REMOVE_CATEGORIES_LIST } from "../../redux/categories";
import Cookies from "js-cookie";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  paper: {
    marginRight: theme.spacing(2),
  },
}));

export default function MenuListComposition({
  firstName,
  handleBackdropClose,
  header,
  image,
}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const { sendRequest } = useHttpClient();
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const [role, setRole] = useState();

  useEffect(() => {
    setRole(user.role);
  }, [user]);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
    if (handleBackdropClose) {
      handleBackdropClose();
    }
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  async function logoutHandler(event) {
    handleClose(event);
    await sendRequest({
      url: `/user/logout`,
    });
    dispatch(LOGOUT());
    Cookies.remove("refreshToken");
    localStorage.removeItem("firstLogin");
    dispatch(REMOVE_ORDERS_LIST());
    dispatch(REMOVE_USERS_LIST());
    dispatch(REMOVE_CATEGORIES_LIST());
    router.push("/login");
  }

  function clickHandler(event, path) {
    handleClose(event);
    router.push(path);
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <div className={classes.root}>
      <div>
        {header ? (
          <IconButton
            aria-controls={open ? "menu-list-grow" : undefined}
            onClick={handleToggle}
            ref={anchorRef}
            aria-haspopup="true"
          >
            <Avatar alt={firstName} src={image} />
          </IconButton>
        ) : (
          <Button
            ref={anchorRef}
            aria-controls={open ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            endIcon={<ExpandMore />}
          >
            Hello, {firstName}
          </Button>
        )}
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="menu-list-grow"
                    onKeyDown={handleListKeyDown}
                  >
                    <a>
                      <MenuItem
                        onClick={(event) => clickHandler(event, "/profile")}
                      >
                        Profile
                      </MenuItem>
                    </a>
                    {role && role === "admin" && (
                      <div>
                        <MenuItem
                          onClick={(event) => clickHandler(event, "/users")}
                        >
                          Users
                        </MenuItem>
                        <MenuItem
                          onClick={(event) =>
                            clickHandler(event, "/categories")
                          }
                        >
                          Categories
                        </MenuItem>
                        <MenuItem
                          onClick={(event) =>
                            clickHandler(event, "/products/create")
                          }
                        >
                          Add Product
                        </MenuItem>
                      </div>
                    )}
                    <Divider />
                    <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
}
