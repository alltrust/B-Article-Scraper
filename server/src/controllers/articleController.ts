import { Request, Response, NextFunction } from "express";
import RawArticles, { Article, IRawArticles } from "../models/Article";
import axios, { AxiosError, AxiosResponse } from "axios";
import cloudscraper from "cloudscraper";
import { scrapeDataFromUrls, formatUrls } from "./helpers";
import { StatusCodes } from "http-status-codes";
import { UserRequest } from "../middleware/auth";

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

// rawArticles.createdBy = req.user.userId
//EMPTY LIST CHECK- check to see if any are emtpy and then the user can satisfy
//or come up with a better plan...

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
        description: description,
      });
      const articleData = await scrapeRawArticles(urls);

      if (!articleData) {
        const error = new Error("There was no article data is scrape");
        next(error);
      } else if (articleData && req.user) {
        articleData.map((article) => {
          rawArticles.articles.push(article);
        });
      }

      await rawArticles.save();
      res.status(StatusCodes.OK).json({ articleData });
    }
  } catch (err) {
    next(err);
  }
};

const showAllArticles = (res: Response) => {
  res.send({ msg: "post articles controller" });
};

export { createRawArticles, showAllArticles };
