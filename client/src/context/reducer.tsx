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
      return { ...state, user: "", token: "" };
    case "GET_ALL_ARTICLES_START":
      return { ...state, isLoading: true };
    case "GET_ARTICLES_SUCCESS":
      if (action.payload) {
        const { articleDoc, currentArticles } = action.payload;
        if (currentArticles) {
          return {
            ...state,
            currentArticles: currentArticles,
            isLoading: false,
          };
        } else {
          return { ...state, articleDoc: articleDoc, isLoading: false };
        }
      } else {
        break;
      }
      case "UPDATE_FAIL":
        return {...state, isLoading:false}
    case "SET_MODAL_ARTICLE":
        return { ...state, modalArticle: action.payload?.modalArticle };
   

    default:
      throw new Error("ERROR FROM REDUCER");
  }
};

export default reducer;
