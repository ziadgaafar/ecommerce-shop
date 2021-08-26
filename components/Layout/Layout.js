import { Container, Backdrop, CircularProgress } from "@material-ui/core";
import Header from "../Header";
import { useHttpClient } from "../../hooks/http-hook";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { LOGIN } from "../../redux/auth";
import { ADD_CART } from "../../redux/cart";
import { ADD_TO_ORDERS_LIST } from "../../redux/orders";
import { ADD_USERS_LIST } from "../../redux/users";
import { ADD_CATEGORIES_LIST } from "../../redux/categories";
import Cookies from "js-cookie";

const Layout = ({ children }) => {
  const { sendRequest } = useHttpClient();
  const { isLoading } = useSelector((state) => state.loading);
  const { cart } = useSelector((state) => state);
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      // update access token if the user is already logged in
      const firstLogin = localStorage.getItem("firstLogin");
      const refreshToken = Cookies.get("refreshToken");
      if (firstLogin) {
        const responseData = await sendRequest({
          ignoreSnackbar: true,
          url: `/user/accessToken`,
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });
        if (!responseData) {
          setLoaded(true);
          return localStorage.removeItem("firstLogin");
        }
        dispatch(
          LOGIN({
            token: responseData.accessToken,
            user: responseData.user,
          })
        );

        // get orders for the logged in user or all orders in admin
        const resData = await sendRequest({
          ignoreSnackbar: true,
          url: "/orders",
          headers: {
            Authorization: `Bearer ${responseData.accessToken}`,
          },
        });
        dispatch(ADD_TO_ORDERS_LIST(resData.orders));

        // get all users and categories if admin
        if (responseData.user.role === "admin") {
          //get all users
          const data = await sendRequest({
            ignoreSnackbar: true,
            url: "/user/all",
            headers: {
              Authorization: `Bearer ${responseData.accessToken}`,
            },
          });
          dispatch(ADD_USERS_LIST(data.users));

          // get categories
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
    <>
      <Backdrop style={{ zIndex: 9999999999 }} open={isLoading}>
        <CircularProgress />
      </Backdrop>
      {loaded && (
        <Container disableGutters fixed>
          <header>
            <Header />
          </header>
          <main style={{ marginTop: 64 }}>{children}</main>
        </Container>
      )}
    </>
  );
};

export default Layout;
