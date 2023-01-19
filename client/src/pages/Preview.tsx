import { useParams } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/PreviewWrapper";

const Preview = () => {
  const { articleDoc } = useAppContext();
  const params = useParams();

  const { articleDocId } = params;

  const articlesPreviewIdx = articleDoc.findIndex(
    (doc) => doc._id === articleDocId
  );

  return (
    <Wrapper>
      {articlesPreviewIdx !== -1 &&
        articleDoc[articlesPreviewIdx].articles &&
        articleDoc[articlesPreviewIdx].articles?.map((article) => (
          <div className="preview-container" key={article._id}>
            <h4>
              {article.companyName !== "" ? article.companyName + ", " : ""}{article.ticker.length > 4 ? article.ticker + " - " : ""}{article.heading}
            </h4>
            <div className="selected-sentences-container">
              <ul>
                {article.contentBody.map(
                  (content) =>
                    content.isSelected && (
                      <li className="selected-sentences" key={content._id}>
                        {content.section.replaceAll("|", ".") + "."}
                      </li>
                    )
                )}
              </ul>
            </div>
            View the Article<a href={article.url}> Here</a>
          </div>
        ))}
    </Wrapper>
  );
};

export default Preview;
