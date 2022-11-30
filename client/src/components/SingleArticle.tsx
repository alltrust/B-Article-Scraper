import { ISingleArticle } from "../context/types";

const SingleArticle = ({ url, heading, contentBody }: ISingleArticle) => {
  return (
      <div className="article-content">
        <div className="article-url">{url}</div>
        <div className="article-heading">{heading}</div>
        <div className="article-body">{contentBody}</div>
      </div>

  );
};

export default SingleArticle;
