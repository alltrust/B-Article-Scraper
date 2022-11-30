import { AllState, StateAndFns } from "./types";
import { user, token } from "./helpers/persistingState";

const initialContextValue: AllState = {
  user: user ? JSON.parse(user) : null,
  token: token,
  articleDoc: [],
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
};

export { initialContextValue };
