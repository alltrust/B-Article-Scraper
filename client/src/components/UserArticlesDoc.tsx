import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ISingleArticle, IArticleDoc } from "../context/types";
import SingleArticle from "./SingleArticle";
import Wrapper from "../assets/wrappers/UserArticleDocWrapper";
import { HiOutlineFolderPlus, HiOutlineFolderMinus } from "react-icons/hi2";
import { BsTrash } from "react-icons/bs";
import { MdOutlinePreview } from "react-icons/md";
import DeleteNotification from "./DeleteNotification";

interface IInitialToggleDoc {
  articleDocShow: boolean;
  articleDocDelete: boolean;
}

const initialToggleDoc: IInitialToggleDoc = {
  articleDocShow: false,
  articleDocDelete: false,
};

const UserArticleDoc = ({ articles, description, _id }: IArticleDoc) => {
  const [toggleValue, setToggleValue] = useState(initialToggleDoc);

  const toggleArticleDoc = () => {
    setToggleValue((prevState) => {
      return { ...prevState, articleDocShow: !prevState.articleDocShow };
    });
  };

  const toggleDelete = () => {
    setToggleValue((prevValue) => {
      return { ...prevValue, articleDocDelete: !prevValue.articleDocDelete };
    });
  };

  return (
    <Wrapper>
      <div className="article-content-delete-container">
        <div className="user-article-container">
          <BsTrash className="react-icon trash-icon" onClick={toggleDelete} />
          {/* pass the info down to another "previewComponent" */}
          <NavLink to={`/articles/${_id}`} className="preview-nav-link">
            <MdOutlinePreview className="react-icon" />
          </NavLink>
          <div className="article-description" onClick={toggleArticleDoc}>
            {description}
          </div>
          <div className="icons-container">
            {!toggleValue.articleDocShow ? (
              <>
                <HiOutlineFolderPlus
                  className="react-icon"
                  onClick={toggleArticleDoc}
                />
              </>
            ) : (
              <HiOutlineFolderMinus
                className="react-icon"
                onClick={toggleArticleDoc}
              />
            )}
          </div>
        </div>
        {toggleValue.articleDocDelete && (
          <DeleteNotification
            border={"var(--primary-900)"}
            toggleDelete={toggleDelete}
            deleteText={
              "Do you want to elete this whole section? This will delete all these articles."
            }
            docId={_id}
          />
        )}
      </div>
      {toggleValue.articleDocShow && articles !== undefined ? (
        articles.map((article: ISingleArticle) => {
          return (
            <SingleArticle
              key={article._id}
              url={article.url}
              docId={_id}
              heading={article.heading}
              contentBody={article.contentBody}
              _id={article._id}
              companyName={article.companyName}
              ticker={article.ticker}
            />
          );
        })
      ) : (
        <div></div>
      )}
    </Wrapper>
  );
};

export default UserArticleDoc;
