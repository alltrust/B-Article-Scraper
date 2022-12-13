const siteCheck = (siteUrl: string) => {
  //take in a list of sites and filter them through a funnel
  //of sites that are known for this to happen
  //check all that apply and apply the cheerio scrape application to it with its new selector to scrape

  const idxofSlash = siteUrl.indexOf("//") + 2;
  const idxAfterDotCom = siteUrl.indexOf("/", idxofSlash);
  const siteName = (siteUrl = siteUrl.slice(idxofSlash, idxAfterDotCom));

  const isBloomberg: string =
    "link.mail.bloombergbusiness.com" || "www.bloomberg.com";

  let articleHeadingSelector: string = "h1";
  let articleParagraphsSelector: string = "article";
  console.log(siteName);
  switch (siteName) {
    case isBloomberg:
      articleParagraphsSelector = ".body-content";
      break;
    case "www.natlawreview.com":
      articleParagraphsSelector = "#normal-wrapper";
      break;
    case "www1.nyc.gov":
      break;
    case "www.benzinga.com":
      articleParagraphsSelector = "#article-body";
      break;
    case "www.accesswire.com":
      articleParagraphsSelector = "#articleBody";
      break;
    case "gothamist.com" || "www.gothamist.com":
      articleParagraphsSelector = ".streamfield";
      break;
    case "www1.nyc.org":
      articleParagraphsSelector = ".richtext";
      break;
    case "investors.crescolabs.com":
      articleParagraphsSelector = ".module_body";
      break;
    case "www.wsfa.com":
      articleParagraphsSelector = ".article-body";
      break;
    case "www.globenewswire.com":
      articleParagraphsSelector = "#main-body-container";
      break;
    case "www.cpr.org":
      articleParagraphsSelector = "#bodyContent";
      break;
    case "www.washingtonpost.com":
      articleParagraphsSelector = ".grid-layout";
      break;

    default:
      articleHeadingSelector = "h1";
      articleParagraphsSelector = "article";
  }
  return { articleParagraphsSelector, articleHeadingSelector };
};

export default siteCheck;
