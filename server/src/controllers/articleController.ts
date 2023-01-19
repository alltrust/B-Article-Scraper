import { Request, Response, NextFunction } from "express";
import RawArticles, { Article } from "../models/Article";
import axios, { AxiosError } from "axios";
import cloudscraper from "cloudscraper";
import {
  scrapeDataFromUrls,
  siteCheck,
  configureScrapedContent,
  tickerAndCoNameFilter,
} from "./helpers";
import { StatusCodes } from "http-status-codes";
import { UserRequest } from "../middleware/auth";
import { BadErrorRequest, NotFoundRequest } from "../errors";
import { Types } from "mongoose";

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
    //check any rejected as well and send info back

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
    console.log(errors);

    throw new Error(errors.message);
  }
};

const createRawArticles = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const { urls, description } = req.body;
  try {
    if (req.user) {
      const rawArticles = new RawArticles({
        createdBy: req.user?.userId,
        description: description || "no description provided",
      });
      const articleData = await scrapeRawArticles(urls);

      if (!articleData) {
        const error = new Error("There was no article data is scrape");
        next(error);
      } else if (articleData && req.user) {
        articleData.map(async (article) => {
          rawArticles.articles.push(article);
        });
        const rawArticleDoc = await rawArticles.save();

        res.status(StatusCodes.CREATED).json({
          message: "Article have been successfully scraped!",
          articles: rawArticleDoc,
        });
      }
    }
  } catch (err) {
    next(err);
  }
};

const getAllArticles = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const articleDoc = await RawArticles.find({ createdBy: req.user?.userId });

    //if no article data is found send error and next it
    res.status(StatusCodes.OK).json({ articleDoc });
  } catch (err) {
    next(err);
  }
};

const patchArticle = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const { articleDocId } = req.params;
  const { updatedArticle } = req.body;
  //check if the updated articles heading and content are empty... then throw an error
  // do this in the front end!
  let editedParagraphs: Article["contentBody"] = [
    {
      section: "",
      isSelected: false,
    },
  ];
  let coName;
  let ticker;

  const hasContentBody: boolean = updatedArticle.contentBody ? true : false;

  if (hasContentBody) {
    const updatedArticleContent = updatedArticle.contentBody[0];
    const configuredContent = configureScrapedContent(updatedArticleContent);

    const firstSentence = configuredContent[0];
    const { scrapedCoName, scrapedTicker } =
      tickerAndCoNameFilter(firstSentence);

    ticker = scrapedTicker;
    coName = scrapedCoName;

    editedParagraphs.pop();
    for (const content of configuredContent) {
      editedParagraphs.push({ section: content, isSelected: false });
    }
  }

  try {
    //do this with $ moongoose aggregate
    const articleParentDoc = await RawArticles.findOne({ _id: articleDocId });

    const docArticles = articleParentDoc?.articles;
    const indexOfArticle = docArticles?.findIndex((article) => {
      return article._id?.toString() === updatedArticle._id;
    });

    if (indexOfArticle !== -1 && indexOfArticle !== undefined && docArticles) {
      docArticles[indexOfArticle].heading = updatedArticle.heading;

      if (hasContentBody) {
        docArticles[indexOfArticle].contentBody = editedParagraphs || "";
      }

      docArticles[indexOfArticle].companyName =
        updatedArticle.companyName !== ""
          ? updatedArticle.companyName
          : coName || "";

      docArticles[indexOfArticle].ticker =
        updatedArticle.ticker !== "" ? updatedArticle.ticker : ticker || "";

      articleParentDoc?.save();
    } else {
      throw new NotFoundRequest("Article you want to update does not exist.");
    }
    res.status(StatusCodes.OK).send({
      message: "Successfully updated your post.",
      articles: articleParentDoc.articles,
    });
  } catch (err) {
    next(err);
  }
};

const deleteArticleDocOrArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { articleId, articleDocId } = req.params;
  let message: string;
  try {
    if (!articleId) {
      await RawArticles.deleteOne({ _id: articleDocId });
      message = "Successfully deleted your entire document";
    } else {
      await RawArticles.findOneAndUpdate(
        { _id: articleDocId },
        { $pull: { articles: { _id: new Types.ObjectId(articleId) } } },
        { new: true }
      );
      message = "Successfully deleted your article";
    }
    res.status(StatusCodes.OK).json({ message: message });
  } catch (err) {
    next(err);
  }
};

const selectSentence = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { articleDocId, articleId, sentenceId } = req.params;
  console.log(sentenceId)
  try {
    const articleDoc = await RawArticles.findOne({_id:articleDocId})
    if(!articleDoc){
      throw new NotFoundRequest("Document not founc")
    }
    const articleIdx = articleDoc.articles.findIndex(article=> article._id?.toString() === articleId);
    const article = articleDoc.articles[articleIdx];

    const sentenceIdx = article.contentBody.findIndex(content=> content._id?.toString()=== sentenceId)

    const sentenceIsSelected = article.contentBody[sentenceIdx].isSelected
    articleDoc.articles[articleIdx].contentBody[sentenceIdx].isSelected = !sentenceIsSelected

    articleDoc.save()

    res.status(StatusCodes.OK)
  } catch (err) {
    console.log(err)
    next(err);
  }
};

export {
  createRawArticles,
  getAllArticles,
  patchArticle,
  deleteArticleDocOrArticle,
  selectSentence
};
