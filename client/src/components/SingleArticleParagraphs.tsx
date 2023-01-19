import { ISingleArticle } from "../context/types";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/SingleArticleParagraphsWrapper";

interface SingleArticleParagraphsProps {
  contentBody: ISingleArticle["contentBody"];
  articleDocId: string;
  articleId: string;
}

const SingleArticleParagraphs = ({
  contentBody,
  articleDocId,
  articleId,
}: SingleArticleParagraphsProps) => {
  const { selectArticleSentence } = useAppContext();

  const toggleSelection = (sentenceId: string) => {
    //also pass in the docId & articleId
    const sentenceIdx= contentBody.findIndex(sentence => sentence._id === sentenceId);
    const isSelected = contentBody[sentenceIdx].isSelected = !contentBody[sentenceIdx].isSelected

    selectArticleSentence(sentenceId, articleDocId, articleId, isSelected);
  };

  return (
    <Wrapper>
      <h5>Click to Select</h5>
      {contentBody[0].section.length > 0
        ? contentBody.map((paragraph) => {
            return (
              <div className="paragraph-container" key={paragraph._id}>
                <p
                  className={
                    paragraph.isSelected ? "sentence selected" : "sentence"
                  }
                  onClick={toggleSelection.bind(null, paragraph._id)}
                >
                  {paragraph.section !== "" && paragraph.section + "."}
                </p>
              </div>
            );
          })
        : "No content found. Edit to add content. "}
    </Wrapper>
  );
};

export default SingleArticleParagraphs;
