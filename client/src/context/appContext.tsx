import axios, { AxiosError } from "axios";
import { createContext, useContext, useReducer } from "react";
import {
  addToLocalStorage,
  removeLocalStorage,
} from "./helpers/persistingState";
import { StateAndFns, initialContextValue } from "./types";
import reducer from "./reducer";
import { UserData, UserPayload } from "./Actions";
import axiosInstance from "./helpers/axiosInstance";

interface ChildrenProps {
  children: React.ReactNode;
}

const AppContext = createContext({} as StateAndFns);

export const AppProvider = ({ children }: ChildrenProps) => {
  const [value, dispatch] = useReducer(reducer, initialContextValue);

  const authFetchInstance = axiosInstance(value.token);

  const setupUser = async (data: UserData) => {
    dispatch({ type: "SETUP_START" });
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/user/register",
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
        //dispatch errors here baud and for axios
        //
        throw new Error(error.message);
      } else {
        const { message } = error.response?.data;
        throw new Error(message);
      }
    }
    // for fail and success cases now
    //persist state if succeeded
    //checkout sessions, cookie, and localstorage options
  };

  const logoutUser = () => {
    //dispatch
    removeLocalStorage();
  };

  const updateUser = async () => {
    const response = await authFetchInstance.patch("/user/update");
    console.log(response);
  };

  const allValues: StateAndFns = {
    user: value.user,
    token: value.token,
    isLoading: value.isLoading,
    setupUser,
    updateUser,
  };
  return (
    <AppContext.Provider value={allValues}>{children}</AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { useAppContext };
