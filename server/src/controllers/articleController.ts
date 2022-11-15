import { Request, Response, NextFunction } from "express";
import { Article } from "../models/Article";
import axios, { AxiosError, AxiosResponse } from "axios";
import cloudscraper from "cloudscraper";
import { scrapeDataFromUrls, formatUrls } from "./helpers";


const getRawArticles = async (req: Request, res: Response) => {
  const { urls } = req.body;
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
      
        return articlesContent
      })
    );
  } catch (err) {
    const errors = err as Error | AxiosError;

    //perhaps refactor to isaxios error AND response of 403
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
              //push an error message into the paragraph or headers section of that index
            } else {
              if (errors.response?.status === 403) {
                console.log("FORBIDDEN STILL, try accessing via web browser");
                //push an error message into the paragraph or headers section of that index
              }
            }
          }
          res.send(articlesContent)
        }
      }
    }
  }
};

const postRawArticles = (res: Response) => {
  res.send({ msg: "post articles controller" });
};

export { getRawArticles, postRawArticles };
