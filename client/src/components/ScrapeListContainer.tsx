import { useState } from "react";
import { useAppContext } from "../context/appContext";
import { ISingleArticle, ISingleArticleUpdate } from "../context/types";
import { FiEdit3 } from "react-icons/fi";
import { EditArticleModal } from "../components";
import Wrapper from "../assets/wrappers/ScrapeListWrapper";

interface IScrapeListContainerProps {
  type: ISingleArticle[];
  styleName?: string | undefined;
  text: string;
}

const ScrapeListContainer = ({
  type,
  styleName,
  text,
}: IScrapeListContainerProps) => {
  const { setArticleToModal } = useAppContext();
  const [showEdit, setShowEdit] = useState(false);

  const showEditModal = (article: ISingleArticle) => {
    setArticleToModal(article);
    setShowEdit(true);
  };

  const closeEditModal = () => {
    setShowEdit(false);
  };

  const articleSiteName = (article: ISingleArticle): string => {
    const urlStartIdx = article.url.indexOf("//") + 2;
    const urlEndIdx = article.url.indexOf("/", urlStartIdx);
    const siteName = article.url.slice(urlStartIdx, urlEndIdx);

    return siteName;
  };

  return (
    <Wrapper>
      <div className={styleName}>
        <h5 className="info-header">{text}</h5>
        <p>{type.length}</p>
        <ul>
          {type.map((article: ISingleArticle, index: number) => {
            const siteName = articleSiteName(article);
            return (
              <li key={article._id}>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  {index + 1} - {siteName}
                </a>
                <FiEdit3
                  className="action-icon"
                  onClick={showEditModal.bind(null, article)}
                />
              </li>
            );
          })}
        </ul>
      </div>
      {showEdit && <EditArticleModal toggleEditModal={closeEditModal} docId={""} />}
    </Wrapper>
  );
};

export default ScrapeListContainer;
