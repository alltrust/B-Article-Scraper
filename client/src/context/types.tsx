import { UserData } from "./Actions";
import {user, token} from './helpers/persistingState'

interface User {
  username: string;
  email: string;
  id: string;
}

export interface AllState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export interface StateAndFns extends AllState {
  setupUser: (data: UserData) => Promise<void>;
  updateUser: ()=> Promise<void>
}
// const user = localStorage.getItem("user");
// const token = localStorage.getItem("token");

const initialContextValue: AllState = {
  user: user ? JSON.parse(user) : null,
  token: token,
  isLoading: false,
};

export { initialContextValue };
