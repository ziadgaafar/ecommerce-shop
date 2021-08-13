import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_SNACKBAR } from "../redux/snackbar";

const withAuth = (WrappedComponent) => {
  return (props) => {
    // checks whether we are on client / browser or server.
    if (typeof window !== "undefined") {
      const router = useRouter();
      const dispatch = useDispatch();

      const { token } = useSelector((state) => state.auth);
      const firstLogin = localStorage.getItem("firstLogin");
      // If there is no access token we redirect to "/login" page.
      useEffect(() => {
        if (!token && !firstLogin) {
          dispatch(
            SET_SNACKBAR({
              snackbarMessage: "Please Login First",
              snackbarType: "warning",
            })
          );
          router.replace(`/login?redirect=${router.pathname}`);
          return null;
        }
      }, [token]);

      // If this is an accessToken we just render the component that was passed with all its props

      return <WrappedComponent {...props} />;
    }

    // If we are on server, return null
    return null;
  };
};

export default withAuth;
