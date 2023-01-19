import cheerio from "cheerio";
import { configureScrapedContent, tickerAndCoNameFilter } from ".";
import { Article } from "../../models/Article";

const scrapeDataFromUrls = (
  dataSet: Buffer,
  pSelector: string,
  hSelector: string
) => {
  let scrapedHeader: string = "";
  let scrapedParagraphs: Article["contentBody"] = [
    {
      section: "",
      isSelected: false,
    },
  ];

  let $ = cheerio.load(dataSet, { xmlMode: true });

  $(`${hSelector}`).each((idx: number, el: cheerio.Element) => {
    const headers = $(el).text().trim();
    if (!headers.includes("&nbsp")) {
      scrapedHeader += headers;
    }
  });
  $(`${pSelector}`).each((idx: number, el: cheerio.Element) => {
    const paragraphs = $(el).find("p").text().replace(/\s\s+/g, "").trim();
    if (paragraphs !== "") {
      const configuredContent = configureScrapedContent(paragraphs);
      scrapedParagraphs.pop();
      for (const content of configuredContent) {
        scrapedParagraphs.push({ section: content, isSelected: false });
      }
    }
  });

  const { section } = scrapedParagraphs[0];

  const firstSentence = section;
  const {scrapedCoName, scrapedTicker} = tickerAndCoNameFilter(firstSentence)
  
  return { scrapedHeader, scrapedParagraphs, scrapedCoName, scrapedTicker };
};

export default scrapeDataFromUrls;
