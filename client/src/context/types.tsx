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
  companyName: string;
  ticker: string;
  contentBody: [
    {
      _id: string;
      section: string;
      isSelected: boolean;
    }
  ];
  docId: string;
}

type IArticleUpdate = Omit<ISingleArticle, "contentBody">;

export interface ISingleArticleUpdate extends IArticleUpdate {
  contentBody?: string[];
}

export interface IArticleDoc {
  _id: string;
  description?: string;
  createdBy?: string;
  articles?: ISingleArticle[];
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
  currentArticlesId: string;
  modalArticle: ISingleArticle;
}

export interface StateAndFns extends AllState {
  setupUser: (data: UserData, endpoint: string) => Promise<void>;
  updateUser: (data:UserData) => Promise<void>;
  displayAlert: (text: string, type: string) => void;
  clearAlert: () => void;
  postArticlesFromUrls: (urls: string[], description: string) => Promise<void>;
  getArticles: () => Promise<void>;
  patchArticles: (
    data: ISingleArticleUpdate,
    docId: string,
    originOfPatch: "SCRAPE OVERVIEW" | "SCRAPE FORM"
  ) => Promise<void>;
  logoutUser: () => void;
  setArticleToModal: (article: ISingleArticle) => void;
  deleteArticleOrDoc: (docId: string, articleId?: string) => void;
  selectArticleSentence: (
    sentenceId: string,
    artcielDocId: string,
    articleId: string,
    isSelected: boolean
  ) => Promise<void>;
}
