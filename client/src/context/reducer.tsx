import { ActionTypesAndPayload } from "./Actions";
import { AllState } from "./types";

const reducer = (state: AllState, action: ActionTypesAndPayload): any => {
  switch (action.type) {
    case "SETUP_START":
      return { ...state, isLoading: true };
    case "SETUP_FAIL":
      //set up alert with appropriate message and message locations
      return { ...state, isLoading: false };
    case "SETUP_SUCCESS":
      if (action.payload) {
        const { user, token } = action.payload;
        return { ...state, isLoading: false, user: user, token: token };
      } else {
        break;
      }
    case "DISPLAY_ALERT":
      return {
        ...state,
        showAlert: true,
        alertText: action.payload?.alertText,
        alertType: action.payload?.alertType,
      };
    case "CLEAR_ALERT":
      return { ...state, showAlert: false, alertText: "", alertType: "" };
    case "LOGOUT_USER":
      return {
        ...state,
        currentArticles: [],
        currentArticlesId: "",
        articleDoc: [],
        modalArticle: [],
        user: "",
        token: "",
      };
    case "GET_ALL_ARTICLES_START":
      return { ...state, isLoading: true };
    case "GET_ARTICLES_SUCCESS":
      if (action.payload) {
        const { articleDoc, currentArticles, currentArticlesId } =
          action.payload;
        if (currentArticles) {
          return {
            ...state,
            currentArticles: currentArticles,
            currentArticlesId: currentArticlesId,
            isLoading: false,
          };
        } else {
          return {
            ...state,
            currentArticles: [],
            currentArticlesId: "",
            articleDoc: articleDoc,
            isLoading: false,
          };
        }
      } else {
        break;
      }
    case "UPDATE_FAIL":
      return { ...state, isLoading: false };
    case "UPDATE_SUCCESS":
      if (action.payload) {
        const { currentArticles, updatedArticleData, docId } = action.payload;
        // let articleToUpdate;
        if (currentArticles) {
          return { ...state, currentArticles: currentArticles };
        } else if (updatedArticleData) {
          // return { ...state };
          const { ticker, companyName, heading, _id } = updatedArticleData;
          //find the docId
          const docIdx = state.articleDoc.findIndex((doc) => {
            return doc._id === docId;
          });

          const selectedDoc = state.articleDoc[docIdx];
          const articleIdx = selectedDoc.articles?.findIndex((article) => {
            return article._id === _id;
          });
          if (
            articleIdx !== undefined &&
            selectedDoc.articles &&
            selectedDoc.articles[articleIdx] !== undefined
          ) {
            selectedDoc.articles[articleIdx].companyName = companyName;
            selectedDoc.articles[articleIdx].ticker = ticker;
            selectedDoc.articles[articleIdx].heading = heading;
          }
          return { ...state };
        } else {
          return { ...state };
        }
      } else {
        break;
      }
    case "UPDATE_SENTENCE":
      const sentenceId = action.payload?.sentenceId;
      const articleDocId = action.payload?.docId;
      const articleId = action.payload?.articleId;
      const isSelected = action.payload?.isSelected;

      const docIdx = state.articleDoc.findIndex(
        (doc) => doc._id === articleDocId
      );
      const articleIdx = state.articleDoc[docIdx].articles?.findIndex(
        (article) => article._id === articleId
      );
      const selectedDoc = state.articleDoc[docIdx];
      const selectedArticles = state.articleDoc[docIdx].articles;

      if (
        articleIdx &&
        selectedArticles !== undefined &&
        selectedDoc.articles
      ) {
        const article = selectedArticles[articleIdx];
        const sentenceIdx = article.contentBody.findIndex(
          (content) => content._id === sentenceId
        );
        if (isSelected !== undefined) {
          selectedDoc.articles[articleIdx].contentBody[sentenceIdx].isSelected =
            isSelected;
        }
        return {
          ...state,
        };

        // return{...state, articleDoc:{...state.articleDoc, articles:{...state.articleDoc.articles, }}}
      } else {
        return { ...state };
      }
    case "SET_MODAL_ARTICLE":
      return { ...state, modalArticle: action.payload?.modalArticle };
    case "DELETE_ARTICLE":
      if (action.payload) {
        const { articleId, docId } = action.payload;
        if (!articleId) {
          const updatedDocs = state.articleDoc.filter((doc) => {
            return doc._id !== docId;
          });
          return { ...state, articleDoc: updatedDocs };
        } else {
          const allArticleDoc = [...state.articleDoc];
          const articleDocIdx = allArticleDoc.findIndex(
            (doc) => doc._id === docId
          );

          const updatedDocArticles = allArticleDoc[
            articleDocIdx
          ].articles?.filter((article) => article._id !== articleId);

          allArticleDoc[articleDocIdx].articles = updatedDocArticles;
          return { ...state, articleDoc: allArticleDoc };
        }
      } else {
        break;
      }

    default:
      throw new Error("ERROR FROM REDUCER");
  }
};

export default reducer;
