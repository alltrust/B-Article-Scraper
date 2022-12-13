import { useAppContext} from "../context/appContext";
import Wrapper from "../assets/wrappers/ScrapeOverviewWrapper";
import { ScrapeListContainer } from "../components";


const ScrapeOverview = () => {
  const { currentArticles } = useAppContext();
  const numOfScrapedUrls = currentArticles.length;

  const successfulScrapes = currentArticles.filter((article) => {
    return article.heading !== "" && article.contentBody[0] !== "";
  });

  const successfulButMissingHeaders = currentArticles.filter((article) => {
    return article.heading === "" && article.contentBody[0] !== "";
  });

  const successfulButMissingContent = currentArticles.filter((article) => {
    return article.contentBody[0] === "" && article.heading !== "";
  });

  const unsuccessfulScrapes = currentArticles.filter((article) => {
    return article.heading === "" && article.contentBody[0] === "";
  });


  return (
    <Wrapper>
      {numOfScrapedUrls > 0 && (
        <div className="list-container">
          <h3>Most Recent Scrape</h3>
          <div className="all-content-container">
            <div className="articles-container">
              <h5 className="info-header"># of attemped articles</h5>
              <p>{numOfScrapedUrls}</p>
              <br></br>
              <h5 className="info-header"># successful </h5>
              <p>{successfulScrapes.length}</p>
            </div>
            {successfulButMissingHeaders.length > 0 && (
              <ScrapeListContainer
                type={successfulButMissingHeaders}
                styleName={"articles-missing-info-container"}
                text={" # Missing artcile Heading"}
              />
            )}
            {successfulButMissingContent.length > 0 && (
              <ScrapeListContainer
                type={successfulButMissingContent}
                styleName={"articles-missing-info-container"}
                text={" # Missing artcile Body "}
              />
            )}
            {unsuccessfulScrapes.length > 0 && (
              <ScrapeListContainer
                type={unsuccessfulScrapes}
                styleName={"articles-failed-container"}
                text={"# Failed to Scrape"}
              />
            )}
          </div>
        </div>
      )}
    </Wrapper>
  );
};

export default ScrapeOverview;
