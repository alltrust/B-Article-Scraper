const formatUrls = (urls: string) => {
    const formattedURLS = urls.replace(/\s+/g, ",").trim();
    const allUrls: string[] = formattedURLS.split(",");
    allUrls.map((string: string) => (string === "" ? allUrls.pop() : allUrls));
    return allUrls;
  };
  export default formatUrls