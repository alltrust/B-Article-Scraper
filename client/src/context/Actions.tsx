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
    | "GET_ARTICLES_SUCCESS";
  payload?: {
    user?: UserPayload["user"];
    token?: UserPayload["token"];
    alertText?: string;
    alertType?: string;
    articleDoc?: [];
    rawArticlesId?: string;
    articleId?:string

  };
}
