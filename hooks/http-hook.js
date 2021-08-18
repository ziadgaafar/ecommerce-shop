import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { SET_SNACKBAR } from "../redux/snackbar";
import axios from "axios";
import { SET_LOADING } from "../redux/loading";
import instance from "../axios";

export const useHttpClient = () => {
  const source = axios.CancelToken.source();
  const dispatch = useDispatch();
  const sendRequest = useCallback(
    async ({ ignoreSnackbar, url, method, body, headers, params }) => {
      try {
        dispatch(SET_LOADING(true));
        const response = await instance({
          method: method || "GET",
          url,
          data: body || null,
          cancelToken: source.token,
          headers: headers || null,
          withCredentials: true,
          params: params || null,
        });
        dispatch(SET_LOADING(false));
        if (!ignoreSnackbar) {
          dispatch(
            SET_SNACKBAR({
              snackbarType: response.data.messageType || "success",
              snackbarMessage: response.data.message,
            })
          );
        }

        return response.data;
      } catch (error) {
        dispatch(SET_LOADING(false));
        if (error.response) {
          dispatch(
            SET_SNACKBAR({
              snackbarType: "error",
              snackbarMessage: error.response.data.message,
            })
          );
        } else {
          dispatch(
            SET_SNACKBAR({
              snackbarType: "error",
              snackbarMessage: error.message,
            })
          );
        }
      }
    },
    []
  );

  useEffect(() => {
    return () => {
      source.cancel();
    };
  }, []);

  return { sendRequest };
};
