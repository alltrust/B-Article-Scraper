import axios, { AxiosError } from "axios";
import { createContext, useContext, useReducer } from "react";
import {
  addToLocalStorage,
  removeLocalStorage,
} from "./helpers/persistingState";
import { ISingleArticle, StateAndFns } from "./types";
import { initialContextValue } from "./initialContextValue";
import { UserData, UserPayload } from "./Actions";
import reducer from "./reducer";
import axiosInstance from "./helpers/axiosInstance";

interface ChildrenProps {
  children: React.ReactNode;
}

const AppContext = createContext({} as StateAndFns);

export const AppProvider = ({ children }: ChildrenProps) => {
  const [value, dispatch] = useReducer(reducer, initialContextValue);

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
    const alertMsgSuccess = {
      text: "Successful Login...loading your scaper",
      type: "success",
    };
    dispatch({ type: "SETUP_START" });
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/user/${endpoint}`,
        data
      );
      const { user, token }: UserPayload = response.data;

      const parsedUser = JSON.stringify(user);
      addToLocalStorage(parsedUser, token);

      dispatch({
        type: "SETUP_SUCCESS",
        payload: { user: user, token: token },
      });
      displayAlert(alertMsgSuccess.text, alertMsgSuccess.type);
    } catch (err) {
      const error = err as AxiosError | Error;
      dispatch({ type: "SETUP_FAIL" });
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

  const postArticlesFromUrls = async (urls: string[], description: string) => {
    const data = {
      urls: urls,
      description: description || "",
    };
    dispatch({ type: "SETUP_START" });

    try {
      const response = await authFetchInstance.post("/articles/", data);
      const { message, articles } = response.data;

      dispatch({
        type: "GET_ARTICLES_SUCCESS",
        payload: { currentArticles: articles },
      });

      displayAlert(message, "success");
      clearAlert();
    } catch (err) {
      console.log(err);
      dispatch({ type: "SETUP_FAIL" });
      const error = err as Error | AxiosError;
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
    }
  };

  const patchArticles = async (updatedArticle: ISingleArticle, docId?:string) => {
    console.log(updatedArticle);
    dispatch({type:"SETUP_START"})
    const data = { updatedArticle };
    try {
      const response = await authFetchInstance.patch(
        `/articles/${docId}`,
        data
      );
      const {message} = response.data;
      displayAlert(message, "success")
      getArticles()

    } catch (err) {
      console.log(err);
      dispatch({type:"UPDATE_FAIL"})
    }
    clearAlert()
  };

  const getArticles = async () => {
    //set is loading etc...
    dispatch({ type: "GET_ALL_ARTICLES_START" });
    try {
      const response = await authFetchInstance.get("/articles/");
      const { articleDoc } = response.data;

      dispatch({
        type: "GET_ARTICLES_SUCCESS",
        payload: { articleDoc: articleDoc },
      });
    } catch (err) {
      console.log(err);
      dispatch({type:"SETUP_FAIL"})
    }
  };

  const setArticleToModal = (article: ISingleArticle) => {
    dispatch({ type: "SET_MODAL_ARTICLE", payload: { modalArticle: article } });
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
    patchArticles,
    setupUser,
    updateUser,
    showAlert: value.showAlert,
    alertText: value.alertText,
    alertType: value.alertType,
    displayAlert,
    clearAlert,
    postArticlesFromUrls,
    getArticles,
    setArticleToModal,
    logoutUser,
    modalArticle: value.modalArticle,
    currentArticles: value.currentArticles,
  };
  return (
    <AppContext.Provider value={allValues}>{children}</AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { useAppContext };
