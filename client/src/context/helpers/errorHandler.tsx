import axios, { AxiosError } from "axios";

const errorHandler = (
  error: Error | AxiosError,
  displayAlert: Function,
  logoutUser: Function
) => {
  if (!axios.isAxiosError(error)) {
    displayAlert(error.message, "danger");
  } else {
    const { message } = error.response?.data;

    if (message !== "jwt expired") {
      displayAlert(message, "danger");
    } else {
      displayAlert("Please login again to continue.", "danger");
      logoutUser();
    }
  }
}; 

export default errorHandler;
