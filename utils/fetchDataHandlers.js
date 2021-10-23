import Cookies from "js-cookie";
import { LOGIN } from "../redux/auth";

const getHeaders = (token) => ({ Authorization: `Bearer ${token}` });

export const postLogin = async (sendRequest, body) => {
  return await sendRequest({
    url: `/user/login`,
    method: "POST",
    body,
  });
};

export const getRefreshedToken = async (sendRequest, refreshToken) => {
  return await sendRequest({
    ignoreSnackbar: true,
    url: `/user/accessToken`,
    headers: getHeaders(refreshToken),
  });
};

export const getOrders = async (sendRequest, accessToken) => {
  return await sendRequest({
    ignoreSnackbar: true,
    url: "/orders",
    headers: getHeaders(accessToken),
  });
};

export const getCategories = async (sendRequest, accessToken) => {
  return await sendRequest({
    ignoreSnackbar: true,
    url: "/categories",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getUsers = async (sendRequest, accessToken) => {
  return await sendRequest({
    ignoreSnackbar: true,
    url: "/user/all",
    headers: getHeaders(accessToken),
  });
};

// For refreshing access token
export const refreshHandler = async (
  dispatch,
  sendRequest,
  auth,
  setLoaded
) => {
  // update access token if the user is already logged in
  const firstLogin = localStorage.getItem("firstLogin");
  const refreshToken = Cookies.get("refreshToken");
  if (firstLogin && !auth.token) {
    const responseData = await getRefreshedToken(sendRequest, refreshToken);
    if (!responseData) {
      return localStorage.removeItem("firstLogin");
    }
    dispatch(
      LOGIN({
        token: responseData.accessToken,
        user: responseData.user,
      })
    );
  }
  setLoaded(true);
};

// When logging in
export const loginHandler = async (values, dispatch, sendRequest) => {
  const responseData = await postLogin(sendRequest, values);
  localStorage.setItem("firstLogin", true);
  Cookies.set("refreshToken", responseData.refreshToken, { expires: 7 });
  dispatch(LOGIN({ token: responseData.accessToken, user: responseData.user }));
};
