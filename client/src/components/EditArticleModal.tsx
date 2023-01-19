import { FormEvent, useRef } from "react";
import { useAppContext } from "../context/appContext";
import ReactDOM from "react-dom";
import { IoMdCloseCircle } from "react-icons/io";
import EditArticleModalWrapper from "../assets/wrappers/EditArticleModalWrapper";
import { ISingleArticleUpdate } from "../context/types";

interface IEditArticleModal {
  toggleEditModal: () => void;
  docId: string;
}

const EditArticleModal = ({ toggleEditModal, docId }: IEditArticleModal) => {
  const { modalArticle, patchArticles, currentArticlesId } = useAppContext();

  const Overlay = () => {
    return <div className="overlay" onClick={toggleEditModal}></div>;
  };

  const Modal = () => {
    const headingRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const bodyRef = useRef() as React.MutableRefObject<HTMLTextAreaElement>;
    const coNameRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const tickerRef = useRef() as React.MutableRefObject<HTMLInputElement>;

    let displayText = "";

    modalArticle.contentBody.forEach((contentObj) => {
      if (contentObj.section !== "") {
        displayText += contentObj.section + ". ";
      }
    });

    const onSubmitEdit = (event: FormEvent) => {
      event.preventDefault();
      const heading = headingRef.current?.value;
      const contentBody = bodyRef.current?.value;
      const companyName = coNameRef.current?.value;
      const ticker = tickerRef.current?.value;

      const bodyContent = [];
      bodyContent.push(contentBody);

      const isBodyUpdated: boolean = displayText === contentBody ? false : true;

      let singleArticleData: ISingleArticleUpdate;
      if (!isBodyUpdated) {
        singleArticleData = {
          _id: modalArticle._id,
          heading: heading,
          companyName: companyName,
          ticker: ticker,
          url: modalArticle.url,
          docId: "",
        };
      } else {
        singleArticleData = {
          _id: modalArticle._id,
          heading: heading,
          contentBody: bodyContent,
          companyName: companyName,
          ticker: ticker,
          url: modalArticle.url,
          docId: "",
        };
      }

      let originOfPatch: "SCRAPE OVERVIEW" | "SCRAPE FORM";

      currentArticlesId
        ? (originOfPatch = "SCRAPE OVERVIEW")
        : (originOfPatch = "SCRAPE FORM");

      patchArticles(
        singleArticleData,
        docId || currentArticlesId,
        originOfPatch
      );

      toggleEditModal();

      //send a patch request in context with these articles
    };
    return (
      <EditArticleModalWrapper>
        <IoMdCloseCircle onClick={toggleEditModal} className="close-button" />
        <h5>Add or Remove info</h5>
        <form onSubmit={onSubmitEdit}>
          <div className="heading-body-container">
            <label htmlFor="heading-value">Article Title</label>
            <input
              type="text"
              id="heading-value"
              defaultValue={modalArticle.heading}
              ref={headingRef}
            />
            <label htmlFor="company-name-value">Co. Name</label>
            <input
              type="text"
              defaultValue={modalArticle.companyName}
              ref={coNameRef}
              id="company-name-value"
            />
            <label htmlFor="ticker-value">Ticker</label>
            <input
              type="text"
              defaultValue={modalArticle.ticker}
              id="ticker-value"
              ref={tickerRef}
            />
            <label htmlFor="body-value">Article Content</label>
            <textarea defaultValue={displayText} ref={bodyRef} />
          </div>
          <button type="submit" className="btn">
            Edit this Scrape
          </button>
        </form>
        <a href={modalArticle.url} target="_blank" rel="noopener noreferrer">
          {modalArticle.url}
        </a>
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
