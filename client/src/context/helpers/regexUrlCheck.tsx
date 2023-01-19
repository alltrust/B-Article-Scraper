const formatUrlsToArray = (urls: string) => {
  const URLSWithoutCommas = urls.replace(/,+/g, "");
  const URLSWithoutWhiteSpace = URLSWithoutCommas.replace(/\s+/g, ",").trim();
  const allUrls: string[] = URLSWithoutWhiteSpace.split(",");

  const nonBlankUrls = allUrls.filter((UrlString: string) => UrlString !== "");
  return nonBlankUrls;
};

const regexUrlCheck = (urls: string) => {
  const unemptyUrls = formatUrlsToArray(urls);

  const cleanedURLS = unemptyUrls.map((url) => {
    const regexCheck =
      /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    const test: boolean = regexCheck.test(url);

    if (test) {
      return { url, isValid: true };
    } else {
      return { url, isValid: false };
    }
  });

  return cleanedURLS;
};

export default regexUrlCheck;
