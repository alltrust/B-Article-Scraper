import { useState } from "react";
import { ISingleArticle, IArticleDoc } from "../context/types";
import SingleArticle from "./SingleArticle";
import Wrapper from "../assets/wrappers/UserArticleDocWrapper";
import { HiOutlineFolderPlus, HiOutlineFolderMinus } from "react-icons/hi2";

const UserArticleDoc = ({ articles, description, _id }: IArticleDoc) => {
  const [articleDocState, setArticleDocState] = useState(false);

  const toggleArticleDoc = () => {
    setArticleDocState((prevState) => !prevState);
  };

  return (
    <Wrapper>
      <div onClick={toggleArticleDoc} className="user-article-container">
        {!articleDocState ? (
          <HiOutlineFolderPlus className="react-icon" />
        ) : (
          <HiOutlineFolderMinus className="react-icon" />
        )}

        <div className="article-description">{description}</div>
      </div>
      {articleDocState &&
        articles &&
        articles.map((article: ISingleArticle) => {
          return (
            <SingleArticle
              key={article._id}
              url={article.url}
              docId= {_id}
              heading={article.heading}
              contentBody={article.contentBody}
              _id={article._id}
            />
          );
        })}
    </Wrapper>
  );
};

export default UserArticleDoc;
