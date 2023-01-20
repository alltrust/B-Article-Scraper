import { AllState } from "./types";
import { getFromLocalStorage } from "./helpers/persistingState";

const { user, token } = getFromLocalStorage();

const initialContextValue: AllState = {
  user:  user? JSON.parse(user) : null,
  token: token,
  currentArticles: [],
  currentArticlesId: "",
  articleDoc: [],
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  modalArticle: {
    _id: "",
    url: "",
    heading: "",
    companyName: "",
    ticker: "",
    contentBody: [{ section: "", isSelected: false, _id: "" }],
    docId: "",
  },
};

export { initialContextValue };
