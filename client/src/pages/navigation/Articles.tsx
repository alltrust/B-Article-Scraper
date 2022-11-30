import { useEffect } from "react";
import { useAppContext } from "../../context/appContext";
import { UserArticleDoc } from "../../components";
import { IArticleDoc } from "../../context/types";
import Wrapper from '../../assets/wrappers/UserArticleDocWrapper'


const Articles = () => {
  const { getArticles, articleDoc } = useAppContext();
  useEffect(() => {
    getArticles();
  }, []);

  if (articleDoc.length === 0) {
    return (
      <div>
        <p>NO ARTICLES SCRAPED FROM YOU YET</p>
      </div>
    );
  }

  return (
    <>
      {articleDoc.map((doc: IArticleDoc) => {
        return (
          <Wrapper key={doc._id} className="user-article-container">
            <UserArticleDoc  articles={doc.articles} description={doc.description}/>
          </Wrapper>
        );
      })}
    </>
  );
};

export default Articles;
