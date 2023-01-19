import { useEffect } from "react";
import { useAppContext } from "../../context/appContext";
import { UserArticleDoc, LoadingSpinner, Alert } from "../../components";
import { IArticleDoc } from "../../context/types";

const Articles = () => {
  const { getArticles, articleDoc, isLoading } = useAppContext();

  useEffect(() => {
    getArticles();
  }, []);

  const noArticlesScrapedDiv: JSX.Element = (
    <div>
      <p>NO ARTICLES SCRAPED FROM YOU YET</p>
    </div>
  );

  return (
    <>
      <Alert />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        articleDoc.map((doc: IArticleDoc) => {
          return (
            <UserArticleDoc
              key={doc._id}
              _id={doc._id}
              articles={doc.articles}
              description={doc.description}
            />
          );
        })
      )}
      {articleDoc.length === 0 && !isLoading && noArticlesScrapedDiv}
    </>
  );
};

export default Articles;
