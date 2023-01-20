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
import errorHandler from "./helpers/errorHandler";

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
      errorHandler(error, displayAlert, logoutUser);
    }
  };

  const updateUser = async (userData:UserData) => {
    dispatch({type:"SETUP_START"})
    // const {email, username} = user
    try{

      const response = await authFetchInstance.patch("/user/update", userData);
      console.log(response);
      const {user, token} = response.data

      if(user){
        dispatch({type:"SETUP_SUCCESS", payload:{user, token}})
      }
    }catch(err){
      const error = err as AxiosError | Error;
      dispatch({type:"SETUP_FAIL"})
      errorHandler(error, displayAlert, logoutUser)


    }
    clearAlert()
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
    } catch (err) {
      const error = err as AxiosError | Error;

      dispatch({ type: "SETUP_FAIL" });
      errorHandler(error, displayAlert, logoutUser);
    }
    clearAlert();
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
      const error = err as AxiosError | Error;
      dispatch({ type: "SETUP_FAIL" });
      errorHandler(error, displayAlert, logoutUser);
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
      const error = err as AxiosError | Error;
      dispatch({ type: "SETUP_FAIL" });
      errorHandler(error, displayAlert, logoutUser);
    }
    clearAlert();
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
      const error = err as AxiosError | Error;

      dispatch({ type: "SETUP_FAIL" });
      errorHandler(error, displayAlert, logoutUser);
    }
    clearAlert();
  };

  const selectArticleSentence = async (
    id: string,
    articleDocId: string,
    articleId: string,
    isSelected: boolean
  ) => {

    try {
      dispatch({
        type: "UPDATE_SENTENCE",
        payload: { sentenceId: id, docId: articleDocId, articleId, isSelected },
      });
      await authFetchInstance.patch(
        `/articles/${articleDocId}/${articleId}/${id}`
      );
    } catch (err) {
      const error = err as AxiosError | Error;

      dispatch({ type: "SETUP_FAIL" });
      errorHandler(error, displayAlert, logoutUser);
    }
    clearAlert();
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
