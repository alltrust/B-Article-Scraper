import { Request, Response, NextFunction } from "express";
import RawArticles, { Article, IRawArticles } from "../models/Article";
import axios, { AxiosError, AxiosResponse } from "axios";
import cloudscraper from "cloudscraper";
import { scrapeDataFromUrls, siteCheck } from "./helpers";
import { StatusCodes } from "http-status-codes";
import { UserRequest } from "../middleware/auth";
import { NotFoundRequest } from "../errors";

const scrapeRawArticles = async (urls: string[]) => {
  const URLS = urls;
  let articlesContent: Article[] = [];

  try {
    const responseArray = await Promise.allSettled(
      URLS.map(async (url) => {
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
        const { scrapedHeader, scrapedParagraphs } = scrapeDataFromUrls(
          data,
          articleParagraphsSelector,
          articleHeadingSelector
        );
        return {
          url: successfulResponse.value.url,
          heading: scrapedHeader,
          contentBody: [scrapedParagraphs],
        };
      });

    articlesContent = fulfilledResults;
    return articlesContent;
  } catch (err) {
    const errors = err as Error | AxiosError;
    console.log(errors);

    if (!axios.isAxiosError(errors)) {
      throw new Error(errors.message);
    } else {
      throw new Error(errors.message);
    }
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
        createdBy: req.user.userId,
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
        const articles = rawArticleDoc.articles;

        res.status(StatusCodes.CREATED).json({
          message: "Article have been successfully scraped!",
          articles: articles,
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
    console.log(req.user?.userId);
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
  try{
    //do this with $ moongoose aggregate
    const articleParentDoc = await RawArticles.findOne({ _id: articleDocId });
  
    const docArticles = articleParentDoc?.articles;
    const indexOfArticle = docArticles?.findIndex((article) => {
      return article._id?.toString() === updatedArticle._id;
    });
  
    if(indexOfArticle !== -1 && indexOfArticle !== undefined && docArticles){
      docArticles[indexOfArticle].heading = updatedArticle.heading;
      docArticles[indexOfArticle].contentBody = updatedArticle.contentBody;
      articleParentDoc?.save()
    }else{
      throw new NotFoundRequest('Article you want to update does not exist.')
    }
    res.status(StatusCodes.OK).send({message: "Successfully updated your post."})
  }catch(err){
    next(err)
  }

  
};

export { createRawArticles, getAllArticles, patchArticle };
