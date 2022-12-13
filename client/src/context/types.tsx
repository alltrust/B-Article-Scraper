import { UserData } from "./Actions";

interface User {
  username: string;
  email: string;
  id: string;
}

export interface ISingleArticle {
  _id: string;
  url: string;
  heading: string;
  contentBody: string;
  docId?: string;
  // children?: React.ReactNode
}

export interface IArticleDoc {
  _id?: string;
  description?: string;
  createdBy?: string;
  articles?: ISingleArticle[];
  // toggleArticleDoc: (docId:string)=> void,
}

export interface AllState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  showAlert: boolean;
  alertText: string;
  alertType: string;
  articleDoc: IArticleDoc[];
  currentArticles: ISingleArticle[];
  modalArticle: ISingleArticle;
}

export interface StateAndFns extends AllState {
  setupUser: (data: UserData, endpoint: string) => Promise<void>;
  updateUser: () => Promise<void>;
  displayAlert: (text: string, type: string) => void;
  clearAlert: () => void;
  postArticlesFromUrls: (urls: string[], description: string) => Promise<void>;
  getArticles: () => Promise<void>;
  patchArticles: (data: ISingleArticle, docId?: string) => Promise<void>;
  logoutUser: () => void;
  setArticleToModal: (article: ISingleArticle) => void;
}
