import { Container, Backdrop } from "@material-ui/core";
import Header from "../Header";
import { useHttpClient } from "../../hooks/http-hook";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { LOGIN } from "../../redux/auth";
import { ADD_CART } from "../../redux/cart";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import CustomScrollbar from "../CustomScrollbar";
import { CodeSharp } from "@material-ui/icons";
import { ADD_CATEGORIES_LIST } from "../../redux/categories";

const variants = {
  hidden: { opacity: 0, x: -200, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: -100 },
};

const loadingContainer = {
  width: "3rem",
  height: "3rem",
  display: "flex",
  justifyContent: "space-around",
};

const loadingCircle = {
  display: "block",
  width: "0.8rem",
  height: "0.8rem",
  backgroundColor: "black",
  borderRadius: "50%",
};

const loadingContainerVariants = {
  start: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  end: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const loadingCircleVariants = {
  start: {
    y: "50%",
  },
  end: {
    y: "150%",
  },
};

const loadingCircleTransition = {
  duration: 0.5,
  yoyo: Infinity,
  ease: "easeInOut",
};

const Layout = ({ children }) => {
  const { sendRequest } = useHttpClient();
  const { isLoading } = useSelector((state) => state.loading);
  const { cart, auth } = useSelector((state) => state);
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      // update access token if the user is already logged in
      const firstLogin = localStorage.getItem("firstLogin");
      const refreshToken = Cookies.get("refreshToken");
      if (firstLogin && !auth.token) {
        const responseData = await sendRequest({
          ignoreSnackbar: true,
          url: `/user/accessToken`,
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });
        if (!responseData) {
          return localStorage.removeItem("firstLogin");
        }
        dispatch(
          LOGIN({
            token: responseData.accessToken,
            user: responseData.user,
          })
        );

        // get all categories if admin
        if (responseData.user.role === "admin") {
          const categoriesData = await sendRequest({
            ignoreSnackbar: true,
            url: "/categories",
            headers: {
              Authorization: `Bearer ${responseData.accessToken}`,
            },
          });
          dispatch(ADD_CATEGORIES_LIST(categoriesData.categories));
        }
      }
      setLoaded(true);
    })();

    // get the saved cart from local storage
    const __next__cart01__eshop = JSON.parse(
      localStorage.getItem("__next__cart01__eshop")
    );
    if (__next__cart01__eshop) {
      dispatch(ADD_CART(__next__cart01__eshop));
    }
  }, []);

  // save the current cart to the local storage whenever the cart changes
  useEffect(() => {
    localStorage.setItem("__next__cart01__eshop", JSON.stringify(cart));
  }, [cart]);

  return (
    <CustomScrollbar>
      <Backdrop style={{ zIndex: 9999999999 }} open={isLoading}>
        <motion.div
          style={loadingContainer}
          variants={loadingContainerVariants}
          initial="start"
          animate="end"
        >
          <motion.span
            style={loadingCircle}
            variants={loadingCircleVariants}
            transition={loadingCircleTransition}
          />
          <motion.span
            style={loadingCircle}
            variants={loadingCircleVariants}
            transition={loadingCircleTransition}
          />
          <motion.span
            style={loadingCircle}
            variants={loadingCircleVariants}
            transition={loadingCircleTransition}
          />
        </motion.div>
      </Backdrop>

      <Container disableGutters fixed>
        <header>
          <Header />
        </header>
        {loaded && (
          <motion.main
            variants={variants}
            initial="hidden"
            animate="enter"
            exit="exit"
            transition={{ type: "linear" }}
            style={{ marginTop: 64 }}
          >
            {children}
          </motion.main>
        )}
      </Container>
    </CustomScrollbar>
  );
};

export default Layout;
