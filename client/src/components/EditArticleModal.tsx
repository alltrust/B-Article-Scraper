import { FormEvent, useRef } from "react";
import { useAppContext } from "../context/appContext";
import ReactDOM from "react-dom";
import EditArticleModalWrapper from "../assets/wrappers/EditArticleModalWrapper";
import { ISingleArticle } from "../context/types";

interface IEditArticleModal {
  toggleEditModal: () => void;
  docId?: string;
}

const EditArticleModal = ({ toggleEditModal, docId }: IEditArticleModal) => {
  const { modalArticle, patchArticles, articleDoc  } = useAppContext();

  
  const Overlay = () => {
    return <div className="overlay" onClick={toggleEditModal}></div>;
  };

  const Modal = () => {
    const headingRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const bodyRef =  useRef() as React.MutableRefObject<HTMLTextAreaElement>;

    const onSubmitEdit = (event: FormEvent) => {
      event.preventDefault();
      const heading = headingRef.current?.value;
      const contentBody = bodyRef.current?.value

      const data:ISingleArticle = {
        _id: modalArticle._id,
        heading:heading,
        contentBody: contentBody,
        url: modalArticle.url
      }
      //find the docId 

      
      patchArticles(data, docId)

      //send a patch request in context with these articles

    };
    return (
      <EditArticleModalWrapper>
        <button onClick={toggleEditModal} className="close-button">
          X
        </button>
        <h5>Add or Remove info</h5>
        <form onSubmit={onSubmitEdit}>
          <div className="heading-body-container">
            <label htmlFor="heading-value">Article Title</label>
            <input type="text" defaultValue={modalArticle.heading} ref={headingRef}/>
            <label htmlFor="body-value">Article Content</label>
            <textarea defaultValue={modalArticle.contentBody} ref={bodyRef}/>
          </div>
          <button type="submit" className="btn">
            Edit this Scrape
          </button>
        </form>
        <a href={modalArticle.url}>{modalArticle.url}</a>
      </EditArticleModalWrapper>
    );
  };

  return (
    <>
      {ReactDOM.createPortal(
        <Overlay />,
        document.getElementById("overlay") as Element
      )}
      {ReactDOM.createPortal(
        <Modal />,
        document.getElementById("modal") as Element
      )}
    </>
  );
};

export default EditArticleModal;
