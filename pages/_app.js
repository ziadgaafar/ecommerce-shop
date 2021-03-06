import { useEffect } from "react";
import Router from "next/router";
import NProgress from "nprogress";
import { Provider } from "react-redux";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

import store from "../redux/store";
import Layout from "../components/Layout";
import Snackbar from "../components/Snackbar";
import "../styles/globals.css";
import "../styles/nprogress.css";
import { AnimatePresence } from "framer-motion";
const theme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#1B1B1B",
    },
  },
  typography: {
    fontFamily: `"Montserrat", serif`,
  },
});

function MyApp({ Component, pageProps, router }) {
  NProgress.configure({ trickle: false });
  Router.onRouteChangeStart = () => {
    NProgress.start();
  };

  Router.onRouteChangeComplete = () => {
    NProgress.done();
  };

  Router.onRouteChangeError = () => {
    NProgress.done();
  };

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <AnimatePresence exitBeforeEnter>
            <Snackbar />
            <Layout key={router.route}>
              <Component {...pageProps} />
            </Layout>
          </AnimatePresence>
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default MyApp;
