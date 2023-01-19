import axios, { AxiosError } from "axios";
import { createContext, useContext, useReducer } from "react";
import {
  addToLocalStorage,
  removeLocalStorage,
} from "./helpers/persistingState";
import { ISingleArticle, ISingleArticleUpdate, StateAndFns } from "./types";
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
    // clearAlert()
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
        payload: {
          currentArticles: articles.articles,
          currentArticlesId: articles._id,
        },
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

  const patchArticles = async (
    updatedArticle: ISingleArticleUpdate,
    docId: string,
    originOfPatch: "SCRAPE OVERVIEW" | "SCRAPE FORM"
  ) => {
    const isBodyUpdated: boolean = updatedArticle.contentBody ? true : false;
    const data = { updatedArticle };

    try {
      const response = await authFetchInstance.patch(
        `/articles/${docId}`,
        data
      );

      const { message, articles } = response.data;
      displayAlert(message, "success");

      if (originOfPatch !== "SCRAPE FORM") {
        dispatch({
          type: "UPDATE_SUCCESS",
          payload: { currentArticles: articles },
        });
      }

      if (!isBodyUpdated && originOfPatch !== "SCRAPE OVERVIEW") {
        dispatch({
          type: "UPDATE_SUCCESS",
          payload: { updatedArticleData: updatedArticle, docId: docId },
        });
      } else if (isBodyUpdated && originOfPatch !== "SCRAPE OVERVIEW") {
        getArticles();
      }
    } catch (err) {
      console.log(err);
      dispatch({ type: "UPDATE_FAIL" });
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
    clearAlert();
  };

  const getArticles = async () => {
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
      clearAlert();
    }
  };

  const deleteArticleOrDoc = async (docId: string, articleId?: string) => {
    //send request to the delete article link and the doc itself
    let idString: string =
      articleId !== undefined ? `${docId}/${articleId}` : `${docId}`;
    try {
      const response = await authFetchInstance.delete(`/articles/${idString}`);
      const { message } = response.data;
      displayAlert(message, "success");

      dispatch({
        type: "DELETE_ARTICLE",
        payload: { articleId: articleId, docId: docId },
      });
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
    clearAlert();
  };

  const selectArticleSentence = async (
    id: string,
    articleDocId: string,
    articleId: string,
    isSelected: boolean
  ) => {
    // const data = { id, articleDocId, articleId, isSelected };
    try {
      dispatch({
        type: "UPDATE_SENTENCE",
        payload: { sentenceId: id, docId: articleDocId, articleId, isSelected },
      });
      await authFetchInstance.patch(
        `/articles/${articleDocId}/${articleId}/${id}`
      );
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
      clearAlert();
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
    deleteArticleOrDoc,
    setupUser,
    updateUser,
    showAlert: value.showAlert,
    alertText: value.alertText,
    alertType: value.alertType,
    displayAlert,
    clearAlert,
    selectArticleSentence,
    postArticlesFromUrls,
    getArticles,
    setArticleToModal,
    logoutUser,
    modalArticle: value.modalArticle,
    currentArticles: value.currentArticles,
    currentArticlesId: value.currentArticlesId,
  };
  return (
    <AppContext.Provider value={allValues}>{children}</AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { useAppContext };
