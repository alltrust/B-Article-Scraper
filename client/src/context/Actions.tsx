export interface UserData {
  username: string;
  email: string;
  password: string;
}

export interface UserPayload {
  user: { username: [UserData["username"]]; email: UserData["email"] };
  token: string;
}
export interface ActionTypesAndPayload {
  type: "SETUP_START" | "SETUP_FAIL" | "SETUP_SUCCESS";
  payload?: {
    user?: UserPayload["user"];
    token?: UserPayload["token"];
  };
}
