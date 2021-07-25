import axios from "axios";
export const isDev = false;
export const hostname = isDev ? "212.174.62.230" : window.location.hostname;
export const baseUrl = "http://localhost:5000/dashboard";

export const useAPI = () => {
  const defaultHeader = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const customFetch = ({
    endpoint,
    method = "GET",
    body = {},
    headers = defaultHeader,
  }) => {
    let url = `${baseUrl}/${endpoint}`;
    const options = {
      method,
      headers,
    };

    if (Object.keys(body).length) options.data = JSON.stringify(body);

    return axios(url, options)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        if (error?.message) {
          console.log(error.message);
        } else {
          console.log("no message error");
        }
      });
  };

  const get = (endpoint, id, query) => {
    const url = `${endpoint}${
      id ? `/${id}${query ? `?${query}` : ""}` : `${query ? `?${query}` : ""}`
    }`;

    return customFetch({ endpoint: url });
  };

  const post = (endpoint, body = {}) => {
    return customFetch({ endpoint, method: "POST", body });
  };

  const put = (endpoint, id, body = {}, token) => {
    if (!id && !body)
      throw new Error("to make a put you must provide the id and the   body");

    const url = `${endpoint}${id ? `/${id}` : ""}`;
    return customFetch({
      endpoint: url,
      method: "PUT",
      body,
      headers: defaultHeader,
    });
  };

  const del = (endpoint, id, query) => {
    const url = `${endpoint}${
      id ? `/${id}${query ? `?${query}` : ""}` : `${query ? `?${query}` : ""}`
    }`;

    return customFetch({ endpoint: url, method: "DELETE" });
  };
  const bulkDel = (endpoint, ids) => {
    if (!ids)
      throw new Error(
        "to make a bulk delete you must provide entity ids as an array"
      );
    const url = `${endpoint}?ids=${ids.join("&ids=")}`;

    return customFetch({ endpoint: url, method: "DELETE" });
  };

  return {
    get,
    post,
    put,
    del,
    bulkDel,
  };
};
