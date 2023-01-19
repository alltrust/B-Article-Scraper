const scrapeTicker = (firstSentence: string): string => {
  const startSearchforExchange =
    firstSentence.search(/\((?=Nasdaq|NASDAQ|NYSE|TSX|CSNX|NEO|VENTURE|CSE)/g) + 1;
  const endOfString = firstSentence.search(/(?<=:[ A-Z|A-Z]{3,})\)/g);
  const tickerIdentifier =
    firstSentence.search(/(?<=\([A-Z|a-z]{3,})\:(?=[A-Z| A-Z])/g) + 1;

  const exchange = firstSentence.substring(
    tickerIdentifier,
    startSearchforExchange
  );
  const ticker = firstSentence
    .substring(tickerIdentifier, endOfString)
    .toUpperCase();

  let exchangeAbb;

  switch (exchange.toUpperCase()) {
    case "NASDAQ:":
      exchangeAbb = "Q";
      break;
    case "NYSE:":
      exchangeAbb = "U";
      break;
    case "TSX:":
      exchangeAbb = "T";
      break;
    case "NEO:":
      exchangeAbb = "NEO";
      break;
    case "CNSX:":
      exchangeAbb = "NEO";
      break;
    case "CSE:" || "CSE":
      exchangeAbb = "C";
      break;
    case "VENTURE:":
      exchangeAbb = "V";
      break;
    default:
      exchangeAbb = "";
  }

  const tickerWithExchange = `(${ticker}-${exchangeAbb} )`;

  return tickerWithExchange;
};

export default scrapeTicker;
