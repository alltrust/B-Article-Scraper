import { ISingleArticle } from "./types";

export interface UserData {
  username?: string;
  email?: string;
  password: string;
}

export interface UserPayload {
  user: {
    username: [UserData["username"]];
    email: UserData["email"];
    id: string;
  };
  token: string;
}
export interface ActionTypesAndPayload {
  type:
    | "SETUP_START"
    | "SETUP_FAIL"
    | "SETUP_SUCCESS"
    | "DISPLAY_ALERT"
    | "CLEAR_ALERT"
    | "LOGOUT_USER"
    | "GET_ALL_ARTICLES_START"
    | "GET_ARTICLES_SUCCESS"
    | "SET_MODAL_ARTICLE"
    | "UPDATE_FAIL";
  payload?: {
    user?: UserPayload["user"];
    token?: UserPayload["token"];
    alertText?: string;
    alertType?: string;
    articleDoc?: [];
    currentArticles?: [];
    modalArticle?:ISingleArticle;
    rawArticlesId?: string;
    articleId?: string;
    msg?: string;
  };
}
