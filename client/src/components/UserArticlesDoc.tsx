import { ISingleArticle, IArticleDoc } from "../context/types";
import SingleArticle from "./SingleArticle";
import Wrapper from "../assets/wrappers/SingleArticleWrapper";

interface ArticleProps extends IArticleDoc {
//   children: React.ReactNode;
}

const UserArticleDoc = ({ articles, description }: ArticleProps) => {
  return (
    <div>
      <Wrapper>
        {articles.map((article: ISingleArticle) => {
          return (
            <SingleArticle
              url={article.url}
              heading={article.heading}
              contentBody={article.contentBody}
              key={article._id}
            >
              {article.heading || "no Header Found"}
            </SingleArticle>
          );
        })}
      </Wrapper>
      {description && description}
    </div>
  );
};

export default UserArticleDoc;
