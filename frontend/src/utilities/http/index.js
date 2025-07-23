import axios from "axios";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export const request = async (
  method,
  url,
  data = null,
  dontSendToken,
  externalToken,
  extraHeaders = {}
) => {
  const token = externalToken || localStorage.getItem("token");

  try {
    const response = await axios({
      method,
      url: `${baseUrl}/${url}`,
      headers: {
        Authorization: !dontSendToken ? `Bearer ${token}` : "",
      },
      ...(data && method === "get" ? { params: data } : { data }),
    });
    return await response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const get = (url, data, dontSendToken = false, extraHeaders = {}) => {
  return request("get", url, data, dontSendToken, undefined, extraHeaders);
};
export const post = (url, data, dontSendToken = false, externalToken) => {
  return request("post", url, data, dontSendToken, externalToken);
};
