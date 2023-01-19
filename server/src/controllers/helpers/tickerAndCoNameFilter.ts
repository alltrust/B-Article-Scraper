import { scrapeTicker, scrapeCoName } from "./index";

const tickerAndCoNameFilter = (firstSentence: string) => {
  let subStringStartIdx;
  let subStringEndIdx;
  let scrapedTicker: string = "";

  if (firstSentence) {
    subStringStartIdx = firstSentence.search(/(--)(?=[ A-Z|A-Z])/g) + 1;
    subStringEndIdx = firstSentence.search(/\|/g);

    scrapedTicker = scrapeTicker(firstSentence);
  }

  let scrapedCoName: string = "";

  if (subStringStartIdx && subStringEndIdx) {
    scrapedCoName = scrapeCoName(
      firstSentence,
      subStringStartIdx,
      subStringEndIdx
    );
  }

  return {scrapedTicker, scrapedCoName}
};

export default tickerAndCoNameFilter;
