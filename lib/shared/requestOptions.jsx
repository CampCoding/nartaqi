import { configs } from "../../configs";

export const requestOptions = ({
  method = "GET",
  body = {},
  headers = {},
  isFile = null
}) => {
  const localToken = typeof window !== 'undefined' ? localStorage.getItem(configs.tokenKey) : '';
  const isValidToken = !!localToken && localToken !== 'undefined' && localToken !== 'null';
  const baseHeaders = {
    ...headers,
    "Content-Type": isFile ? "multipart/form-data" : "application/json",
  };
  if (isValidToken) {
    baseHeaders["Authorization"] = `Bearer ${localToken}`;
  }

  const options = {
    method: method,
    headers: baseHeaders
  };
  options.body = body;

  return options;
};