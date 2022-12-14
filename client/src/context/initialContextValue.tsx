import { AllState, StateAndFns } from "./types";
import { user, token } from "./helpers/persistingState";

const initialContextValue: AllState = {
  user: user ? JSON.parse(user) : null,
  token: token,
  currentArticles: [],
  articleDoc: [],
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  modalArticle: { _id: "", url: "", heading: "", contentBody: "" },
};

export { initialContextValue };
