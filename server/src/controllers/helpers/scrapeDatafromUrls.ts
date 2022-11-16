import cheerio from "cheerio";

const scrapeDataFromUrls = async (
    dataSet: Buffer,
) => {
  let scrapedHeader: string= '';
  let scrapedParagraphs: string= '';

  let $ = cheerio.load(dataSet, { xmlMode: true });

  $("h1").each((idx: number, el: cheerio.Element) => {
    const headers = $(el).text().trim();
    if (!headers.includes("&nbsp")) {
      scrapedHeader += headers
    }
  });
  $("article").each((idx: number, el: cheerio.Element) => {
    const paragraphs = $(el).find("p").text().replace(/\s\s+/g, "").trim();
    if (paragraphs !== "") {
      scrapedParagraphs += paragraphs
    }
  });
  return {scrapedHeader, scrapedParagraphs} 
};

export default scrapeDataFromUrls;
