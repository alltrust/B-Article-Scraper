import { Request, Response, NextFunction } from "express";
import RawArticles, { Article, IRawArticles } from "../models/Article";
import axios, { AxiosError, AxiosResponse } from "axios";
import cloudscraper from "cloudscraper";
import { scrapeDataFromUrls, formatUrls } from "./helpers";
import { StatusCodes } from "http-status-codes";

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

        return articlesContent;
      })
    );
  } catch (err) {
    const errors = err as Error | AxiosError;

    if (!axios.isAxiosError(errors)) {
      console.log(errors.message, "FROM ERROER");
    } else {
      if (errors.response?.status === 403) {
        const blockedURL = errors.response?.config.url;
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
          return articlesContent;
        }
      }
    }
  }
};

const createRawArticles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { urls }= req.body;
  try {
    const articleData = await scrapeRawArticles(urls);


    if (!articleData) {
      const error = new Error("There was no article data is scrape");
      next(error);
    }else{
      const rawArticles = new RawArticles() 

      articleData.map((article)=>{
        rawArticles.articles.push(article)
      })
      //EMPTY LIST CHECK- check to see if any are emtpy and then the user can satisfy
      //or come up with a better plan... 
      await rawArticles.save()
    }
    console.log(articleData)

    // const AllCurrentArticles = await RawArticles.create(articleData) 
    // console.log(AllCurrentArticles)
    res.status(StatusCodes.OK).json({ articleData });
  } catch (err) {
    next(err);
  }
};

const showAllArticles = (res: Response) => {
  res.send({ msg: "post articles controller" });
};

export { createRawArticles, showAllArticles };
