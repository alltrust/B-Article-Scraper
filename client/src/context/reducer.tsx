import { ActionTypesAndPayload } from "./Actions";
import { AllState } from "./types";

const reducer = (state: AllState, action: ActionTypesAndPayload):any => {
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
      }else{
        break
      }
    default:
      throw new Error("ERROR FROM REDUCER");
  }
};

export default reducer;
