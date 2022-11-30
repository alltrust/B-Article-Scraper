import axios, { AxiosError } from "axios";
import { createContext, useContext, useReducer } from "react";
import {
  addToLocalStorage,
  removeLocalStorage,
} from "./helpers/persistingState";
import { StateAndFns } from "./types";
import { initialContextValue } from "./initialContextValue";
import { UserData, UserPayload } from "./Actions";
import reducer from "./reducer";
import axiosInstance from "./helpers/axiosInstance";

interface ChildrenProps {
  children: React.ReactNode;
}

//check for JWT expiration!

const AppContext = createContext({} as StateAndFns);

export const AppProvider = ({ children }: ChildrenProps) => {
  const [value, dispatch] = useReducer(reducer, initialContextValue);
  // const navigate = useNavigate()

  const authFetchInstance = axiosInstance(value.token);

  const displayAlert = (text: string, type: string) => {
    dispatch({
      type: "DISPLAY_ALERT",
      payload: { alertText: text, alertType: type },
    });
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: "CLEAR_ALERT" });
    }, 3000);
    return;
  };

  const setupUser = async (data: UserData, endpoint: string) => {
    dispatch({ type: "SETUP_START" });
    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/user/${endpoint}`,
        data
      );
      const { user, token }: UserPayload = response.data;

      const parsedUser = JSON.stringify(user);
      addToLocalStorage(parsedUser, token);

      dispatch({
        type: "SETUP_SUCCESS",
        payload: { user: user, token: token },
      });
    } catch (err) {
      const error = err as AxiosError | Error;
      if (!axios.isAxiosError(error)) {
        displayAlert(error.message, "danger");
      } else {
        const { message } = error.response?.data;
        displayAlert(message, "danger");
        // clearAlert()
        // throw new Error(message);
      }
    }
    // for fail and success cases now
    //persist state if succeeded
    //checkout sessions, cookie, and localstorage options
  };

  const updateUser = async () => {
    const response = await authFetchInstance.patch("/user/update");
    console.log(response);
  };

  const postArticlesFromUrls = async (urls: string, description: string) => {
    const data = {
      urls: urls,
      description: description || "",
    };
    //dispatch starting of requet

    try {
      const response = await authFetchInstance.post("/articles/", data);
      //retrieve response with an articlePayload
      // console.log(response.data)
      const { articlesWithMissingInfo } = response.data;
      console.log(articlesWithMissingInfo);
      // let emptyHeadings: number;
      // let emptyParagraphs: number ;
      // articles.map()
      // once data is recieved, check for empty paragraphs & headings
      // seperarate the empties and make another request to that url- which then will patch the
      //article with that pertaining id.
      //if it remains empty send a message to encourage user to update it manually by accessing the
      //corresponding website
    } catch (err) {
      console.log(err);
      const error = err as Error | AxiosError;
      if (!axios.isAxiosError(error)) {
        displayAlert(error.message, "danger");
      } else {
        const { message } = error.response?.data;
        if (message !== "jwt expired") {
          displayAlert(message, "danger");
        }
        logoutUser();
        displayAlert("Please login again to continue.", "danger");
      }
    }
  };

  const getArticles = async () => {
    try {
      const response = await authFetchInstance.get("/articles/");
      const { articleDoc } = response.data;
      console.log(articleDoc);
      dispatch({
        type: "GET_ARTICLES_SUCCESS",
        payload: { articleDoc: articleDoc },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const logoutUser = () => {
    removeLocalStorage();
    dispatch({ type: "LOGOUT_USER" });
  };

  const allValues: StateAndFns = {
    user: value.user,
    token: value.token,
    articleDoc: value.articleDoc,
    isLoading: value.isLoading,
    setupUser,
    updateUser,
    showAlert: value.showAlert,
    alertText: value.alertText,
    alertType: value.alertType,
    displayAlert,
    clearAlert,
    postArticlesFromUrls,
    getArticles,
  };
  return (
    <AppContext.Provider value={allValues}>{children}</AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { useAppContext };
