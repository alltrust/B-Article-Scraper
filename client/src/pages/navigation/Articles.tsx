import { useEffect } from "react";
import { useAppContext } from "../../context/appContext";
import { UserArticleDoc, LoadingSpinner, Alert } from "../../components";
import { IArticleDoc } from "../../context/types";

const Articles = () => {
  const { getArticles, articleDoc, isLoading, clearAlert } = useAppContext();

  
  useEffect(() => {
    getArticles();
  }, []);



  // if(currentArticles.length > 0 || onRender === true){
    
  // }

  

  if (articleDoc.length === 0) {
    return (
      <div>
        <p>NO ARTICLES SCRAPED FROM YOU YET</p>
      </div>
    );
  }
  

  return (
    <>
    <Alert/>
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
    </>
  );
};

export default Articles;
