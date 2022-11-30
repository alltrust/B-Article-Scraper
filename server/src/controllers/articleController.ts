import { Request, Response, NextFunction } from "express";
import RawArticles, { Article, IRawArticles } from "../models/Article";
import axios, { AxiosError, AxiosResponse } from "axios";
import cloudscraper from "cloudscraper";
import { scrapeDataFromUrls, formatUrls } from "./helpers";
import { StatusCodes } from "http-status-codes";
import { UserRequest } from "../middleware/auth";
import { STATUS_CODES } from "http";

const scrapeRawArticles = async (urls: string) => {
  const URLS: string[] = formatUrls(urls);
  let articlesContent: Article[] = [];

  try {
    await Promise.all(
      URLS.map(async (url: string, urlIdx: number) => {
        articlesContent[urlIdx] = {
          heading: "",
          contentBody: [],
          url: url,
        };
        //remove all commas


        const { data }: AxiosResponse = await axios.get(url);
        const { scrapedHeader, scrapedParagraphs } = await scrapeDataFromUrls(
          data
        );

        articlesContent[urlIdx].heading += scrapedHeader;
        articlesContent[urlIdx].contentBody.push(scrapedParagraphs);
      })
    );
  } catch (err) {
    const errors = err as Error | AxiosError;

    if (!axios.isAxiosError(errors)) {
      console.log(errors.message, "FROM ERROER");
    } else {
      if (errors.response?.status === 403) {
        const blockedURL = errors.response?.config.url;
        console.log(blockedURL);
        if (blockedURL) {
          try {
            const finalUrlAttmept = await cloudscraper(blockedURL);
            const blockedURLIndex = articlesContent.findIndex(
              (scrapedData: any) => scrapedData.url === blockedURL
            );
            if (blockedURLIndex !== -1) {
              const { scrapedHeader, scrapedParagraphs } =
                await scrapeDataFromUrls(finalUrlAttmept);

              articlesContent[blockedURLIndex].heading += scrapedHeader;
              articlesContent[blockedURLIndex].contentBody.push(
                scrapedParagraphs
              );
            }
          } catch (err) {
            const errors = err as AxiosError | Error;
            if (!axios.isAxiosError(errors)) {
              console.log(errors.message);
            } else {
              if (errors.response?.status === 403) {
                console.log("FORBIDDEN STILL, try accessing via web browser");
              }
            }
          }
        }
      }
    }
  }
  return articlesContent;
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
        const articles = rawArticleDoc.articles

        const articlesWithMissingInfo: Article[] = []
        articles.map((article)=>{
          if(article.contentBody.pop() ===  "" || article.heading === ""){
            articlesWithMissingInfo.push(article)
          }
        })
        res.status(StatusCodes.CREATED).json({ articlesWithMissingInfo });

        //check heading paragraph count and empties, and send back the data for THOSE ones to rescrape
      }
    }
  } catch (err) {
    next(err);
  }
};

const getAllArticles = async(req:UserRequest, res:Response, next:NextFunction) => {
  try{
    console.log(req.user?.userId)
    const articleDoc = await RawArticles.find({createdBy: req.user?.userId})
    //if no article data is found send error and next it
    res.status(StatusCodes.OK).json({articleDoc})
  }catch(err){
    console.log(err)
  }


};

export { createRawArticles, getAllArticles };
