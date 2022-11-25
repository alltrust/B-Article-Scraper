import { UserData } from "./Actions";

interface User {
  username: string;
  email: string;
  id: string;
}

export interface AllState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  showAlert: boolean;
  alertText: string;
  alertType: string;
}

export interface StateAndFns extends AllState {
  setupUser: (data: UserData, endpoint:string) => Promise<void>;
  updateUser: () => Promise<void>;
  displayAlert: (text: string, type: string) => void;
  clearAlert: () => void;
  postArticlesFromUrls: (urls:string) => Promise<void>
}
