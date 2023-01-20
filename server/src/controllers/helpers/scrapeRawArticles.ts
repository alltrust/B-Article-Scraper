import axios, { AxiosError } from "axios";
import cloudscraper from "cloudscraper";
import { Article } from "../../models/Article";
import { siteCheck, scrapeDataFromUrls } from "../helpers";

const scrapeRawArticles = async (urls: string[]) => {
  let articlesContent: Article[] = [];

  try {
    const responseArray = await Promise.allSettled(
      urls.map(async (url) => {
        const response = await axios.get(url);
        return { response, url };
      })
    );

    const rejectedResults = responseArray
      .filter(
        <T>(
          response: PromiseSettledResult<T>
        ): response is PromiseRejectedResult => response.status === "rejected"
      )
      .map((responses) => {
        const rejectedConfig = responses.reason.config;
        const rejectedUrl = rejectedConfig.url;
        return rejectedUrl;
      });

    const responseArrayOfRejected = await Promise.allSettled(
      rejectedResults.map(async (url) => {
        const response = await cloudscraper(url);
        return { response, url };
      })
    );

    const fullResponseArray = responseArray.concat(responseArrayOfRejected);

    const fulfilledResults = fullResponseArray
      .filter(
        <T>(
          response: PromiseSettledResult<T>
        ): response is PromiseFulfilledResult<T> => {
          return response.status === "fulfilled";
        }
      )
      .map((successfulResponse) => {
        let data = successfulResponse.value.response.data;
        if (!data) {
          data = successfulResponse.value.response;
        }
        const { articleParagraphsSelector, articleHeadingSelector } = siteCheck(
          successfulResponse.value.url
        );
        //insert scraped ticker and scraped co. name
        const {
          scrapedHeader,
          scrapedParagraphs,
          scrapedCoName,
          scrapedTicker,
        } = scrapeDataFromUrls(
          data,
          articleParagraphsSelector,
          articleHeadingSelector
        );
        return {
          url: successfulResponse.value.url,
          heading: scrapedHeader,
          companyName: scrapedCoName,
          ticker: scrapedTicker,
          contentBody: scrapedParagraphs,
        };
      });

    articlesContent = fulfilledResults;
    return articlesContent;
  } catch (err) {

    const errors = err as Error | AxiosError;
    throw new Error(errors.message);
  }
};

export default scrapeRawArticles
