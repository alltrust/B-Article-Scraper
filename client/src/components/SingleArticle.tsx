import { useState } from "react";
import { useAppContext } from "../context/appContext";
import { ISingleArticle } from "../context/types";
import {EditArticleModal} from '../components'
import Wrapper from "../assets/wrappers/SingleArticleWrapper";
import { BiMinusCircle } from "react-icons/bi";
import { BsPlus } from "react-icons/bs";
import {FiEdit3} from "react-icons/fi"

const SingleArticle = ({ url, heading, contentBody, _id, docId }: ISingleArticle) => {
  const {setArticleToModal} = useAppContext()
  const [articleState, setContentState] = useState(false);
  const [showEdit, setShowEdit ] = useState(false);

  const showModalAndAssignArticle= ()=>{
    const article = {url, heading, contentBody, _id}
    setShowEdit(true)
    setArticleToModal(article)
  }

  const closeModal = ()=>{
    setShowEdit(false)
  }

  const toggleContentState = () => {
    setContentState((prevState) => !prevState);
  };

  return (
    <Wrapper>
      <div key={_id} className="single-article-container">
        {articleState && (
          <div className="article-content">
            <div className="article-url">{url}</div>
            <div className="article-heading">{heading}</div>
            <div className="article-body">{contentBody}</div>
          </div>
        )}
        {heading !== "" ? (
          <div className="article-header-container">
            {!articleState && heading}
          </div>
        ) : (
          <div className="non-article-header-container">
            No Article Header Scraped
          </div>
        )}
        <div className="icons-container">
          <FiEdit3 className="action-icon" onClick={showModalAndAssignArticle}/>
          {!articleState ? (
            <BsPlus className="action-icon" onClick={toggleContentState} />
          ) : (
            <BiMinusCircle
              className="action-icon"
              onClick={toggleContentState}
            />
          )}
        </div>
      </div>
      {showEdit && <EditArticleModal toggleEditModal={closeModal} docId={docId}/>}
    </Wrapper>
  );
};

export default SingleArticle;
