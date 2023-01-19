import { useState } from "react";
import { useAppContext } from "../context/appContext";
import { ISingleArticle } from "../context/types";
import { EditArticleModal, SingleArticleParagraphs } from "../components";
import Wrapper from "../assets/wrappers/SingleArticleWrapper";
import { BiMinusCircle } from "react-icons/bi";
import { BsPlus, BsTrash } from "react-icons/bs";
import { FiEdit3 } from "react-icons/fi";
import DeleteNotification from "./DeleteNotification";

interface IInitialToggles {
  contentShow: boolean;
  showEdit: boolean;
  showDelete: boolean;
}

const initialToggles: IInitialToggles = {
  contentShow: false,
  showEdit: false,
  showDelete: false,
};

const SingleArticle = ({
  url,
  heading,
  contentBody,
  _id,
  docId,
  companyName,
  ticker,
}: ISingleArticle) => {
  const { setArticleToModal } = useAppContext();
  const [toggleValue, setToggleValue] = useState(initialToggles);


  const showModalAndAssignArticle = () => {
    const article = {
      url,
      heading,
      contentBody,
      _id,
      docId,
      companyName,
      ticker,
    };

    setToggleValue((prevValue) => {
      return { ...prevValue, showEdit: true };
    });
    setArticleToModal(article);
  };

  const closeModal = () => {
    setToggleValue((prevValue) => {
      return { ...prevValue, showEdit: false };
    });
  };

  const toggleDelete = () => {
    setToggleValue((prevValue) => {
      return { ...prevValue, showDelete: !prevValue.showDelete };
    });
  };

  const toggleContentState = () => {
    setToggleValue((prevValue) => {
      return { ...prevValue, contentShow: !prevValue.contentShow };
    });
  };

  let backgroundColor: string = "var(--primary-500)";
  let color: string = "#fff";

  const isBodyEmpty = contentBody.length <= 1;
  if (isBodyEmpty || heading === "") {
    backgroundColor = "#c7ee53";
    color = "var(--black)";
  }
  if (heading === "" && isBodyEmpty) {
    backgroundColor = "#e46f78";
    color = "#fff";
  }

  return (
    <Wrapper backgroundColor={backgroundColor} color={color}>
      <div key={_id} className="single-article-container">
        {toggleValue.contentShow && (
          <div className="article-content">
            <div className="article-url-container">
              View Article
              <a href={url} target="_blank" rel="noopener noreferrer"  className="article-url link">
                Here
              </a>
            </div>
            <div className="article-property">
              <h5>Co. Name:</h5>
              <p>{companyName}</p>
            </div>
            <div className="article-property">
              <h5>Ticker:</h5>
              <p>{ticker}</p>
            </div>
            <div className="article-property">
              <h5>Heading:</h5>
              <p>{heading!== "" ? heading : "No heading found"}</p>
            </div>
            <SingleArticleParagraphs articleDocId={docId} articleId={_id} contentBody={contentBody} />
          </div>
        )}
        {heading !== "" ? (
          <div className="article-header-container">
            {!toggleValue.contentShow && heading}
          </div>
        ) : (
          <div className="non-article-header-container">
           {!toggleValue.contentShow && "No heading found"}
          </div>
        )}
        <div className="icons-container">
          <FiEdit3
            className="action-icon"
            onClick={showModalAndAssignArticle}
          />
          <BsTrash className="action-icon" onClick={toggleDelete} />
          {!toggleValue.contentShow ? (
            <BsPlus className="action-icon" onClick={toggleContentState} />
          ) : (
            <BiMinusCircle
              className="action-icon"
              onClick={toggleContentState}
            />
          )}
        </div>
      </div>
      {toggleValue.showEdit && (
        <EditArticleModal toggleEditModal={closeModal} docId={docId} />
      )}
      {toggleValue.showDelete && (
        <DeleteNotification
          toggleDelete={toggleDelete}
          border={backgroundColor}
          deleteText={"Do you want to delete this article?"}
          docId={docId}
          articleId={_id}
        />
      )}
    </Wrapper>
  );
};

export default SingleArticle;
