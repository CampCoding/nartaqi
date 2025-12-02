// api/index.js
import axios from "axios";
import { handleRespons } from "./handleResponse";
import { requestOptions } from "./requestOptions";
import { base_url } from "@/constants";

const rawRequest = (method, endpoint, options = {}, new_base_url = base_url) =>
  axios({
    url: `${new_base_url}${endpoint}`,
    method,
    data: options.body, // axios supports body on DELETE too
    params: options.params,
    ...requestOptions({ method, ...options }),
  });

// Keep if you still want to redirect on 401 elsewhere
const safeRedirectToLogin = () => {
  if (typeof window !== "undefined") {
    const onLogin = window.location.pathname === "/login";
    try {
      localStorage.clear();
    } catch {}
    if (!onLogin) window.location.href = "/login";
  }
};

// 🔴 NEW: global Axios interceptor to catch 401s
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);
    const status = error?.response?.status;
    if (status === 401) {
      safeRedirectToLogin();
    }
    // Keep the rejection so Redux thunks / callers still see an error
    return (error);
  }
);

export const api = {
  get: async (endpoint, options = {}, new_base_url = base_url) =>
    handleRespons(
      await rawRequest("GET", endpoint, { ...options, body: null }, new_base_url)
    ),

  post: async (endpoint, options = {}, new_base_url = base_url) =>
    handleRespons(
      await rawRequest("POST", endpoint, options, new_base_url)
    ),

  put: async (endpoint, options = {}, new_base_url = base_url) =>
    handleRespons(
      await rawRequest("PUT", endpoint, options, new_base_url)
    ),

  patch: async (endpoint, options = {}, new_base_url = base_url) =>
    handleRespons(
      await rawRequest("PATCH", endpoint, options, new_base_url)
    ),

  delete: async (endpoint, options = {}, new_base_url = base_url) =>
    handleRespons(
      await rawRequest("DELETE", endpoint, options, new_base_url)
    ),
};
