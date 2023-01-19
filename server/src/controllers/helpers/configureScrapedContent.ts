const handleMonthNameChange = (text: string): string => {
  const periodAfterMonthAbbreviationRegEx: RegExp =
    /(?<= Jan| Feb| Mar| Apr| May| Jun| Jul| Aug| Sept| Sep| Oct| Nov| Dec)\./g;
  const textWithUpdatedMonthName = text.replace(
    periodAfterMonthAbbreviationRegEx,
    " "
  );
  return textWithUpdatedMonthName;
};

const handleMeridiumAbbreviation = (text: string): string => {
  const meridiumAbbreviationRegEx: RegExp = /(?<= a| p|\.m)\./g;
  const textWithUpdatedMeridium = text.replace(meridiumAbbreviationRegEx, "");
  return textWithUpdatedMeridium;
};

const handlePlaceholdersForPeriods = (text: string) => {
  let textWithPlaceholders: string;
  const nbspRegex: RegExp = /;&nbsp|&nbsp/g;
  const decimalRegex: RegExp = /(?<=[0-9])\.(?=[0-9])/g;
  const periodsBetweenCharRegex: RegExp = /(?<=[A-Z])\.(?=[a-z|A-Z])/g;
  const commonAbbreviationsRegex: RegExp = /(?<=\.[a-z|A-Z])\./g;
  const honorificsAndPopularAbbrRegex: RegExp =
    /(?<= Mr| Dr| Mrs| Ms| Prof| Gov| Corp| Co| ltd| Ltd| Inc|Sen)\./g;
  // const random
  textWithPlaceholders = text
    .replace(nbspRegex, " ")
    .replace(decimalRegex, "|")
    .replace(commonAbbreviationsRegex, "")
    .replace(periodsBetweenCharRegex, "|")
    .replace(honorificsAndPopularAbbrRegex, "|");

  return textWithPlaceholders;
};

const configureScrapedContent = (text: string): string[] => {
  let configuredText: string;
  configuredText = handleMonthNameChange(text);
  configuredText = handleMeridiumAbbreviation(configuredText);
  configuredText = handlePlaceholdersForPeriods(configuredText);

  const splitSeparator: RegExp = /[\.?](?= |[A-Z])/g 

  return configuredText.split(splitSeparator);
};

// const test = configureScrapedContent(text)
// console.log(test)

export default configureScrapedContent;
