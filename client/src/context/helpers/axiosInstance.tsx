import axios from "axios";

const axiosInterceptors = (token: string) => {
  const authFetchInstance = axios.create({
    baseURL: "/api/v1",
  });
  authFetchInstance.interceptors.request.use(
    function (config) {
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  authFetchInstance.interceptors.response.use(
    function (response) {
      // logoutUser()
      return response;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  return authFetchInstance;
};

export default axiosInterceptors;
