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
    return
  };

  const setupUser = async (data: UserData, endpoint: string) => {
    dispatch({ type: "SETUP_START" });
    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/user/${endpoint}`,
        data
      );
      const { user, token }: UserPayload = response.data;

      dispatch({
        type: "SETUP_SUCCESS",
        payload: { user: user, token: token },
      });

      const parsedUser = JSON.stringify(user);
      addToLocalStorage(parsedUser, token);
    } catch (err) {
      const error = err as AxiosError | Error;
      if (!axios.isAxiosError(error)) {
       
        displayAlert(error.message, "danger")
      } else {
        const { message } = error.response?.data;
        displayAlert(message, "danger")
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

  const postArticlesFromUrls = async(urls: string)=>{
    const data = {
      urls:urls,
      description: ''
    }
    //dispatch starting of requet

    try{
      const response = await authFetchInstance.post("/articles/",data)
      //retrieve response with an articlePayload
      const {articleData} = response.data
      console.log(articleData)

    }catch(err){
      console.log(err)
    }
  }

  const logoutUser = () => {
    //dispatch
    removeLocalStorage();
  };

  const allValues: StateAndFns = {
    user: value.user,
    token: value.token,
    isLoading: value.isLoading,
    setupUser,
    updateUser,
    showAlert: value.showAlert,
    alertText: value.alertText,
    alertType: value.alertType,
    displayAlert,
    clearAlert,
    postArticlesFromUrls
    
  };
  return (
    <AppContext.Provider value={allValues}>{children}</AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { useAppContext };
