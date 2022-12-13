import { FormEvent, useRef, useState } from "react";
import { useAppContext } from "../../context/appContext";
import Wrapper from "../../assets/wrappers/ScrapeFormWrapper";
import { Alert, ScrapeOverview, LoadingSpinner } from "../../components";
import regexUrlCheck from "../../context/helpers/regexUrlCheck";

const ScrapeForm = () => {
  const {
    postArticlesFromUrls,
    displayAlert,
    clearAlert,
    showAlert,
    isLoading,
  } = useAppContext();

  const urlsRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    const urlsValue = urlsRef.current?.value;
    const descValue = descriptionRef.current?.value;

    if (urlsValue?.trim() === "") {
      const alertmsg: string = "Please insert a valid URL";
      displayAlert(alertmsg, "danger");
      clearAlert();
      return;
    }
    if (urlsValue !== undefined && descValue !== undefined) {
      const regexValue = regexUrlCheck(urlsValue);

      const isValid: (currentUrl: {
        isValid: boolean;
        url: string;
      }) => boolean = (currentUrl) => currentUrl.isValid === true;

      const allUrlsAreValid = regexValue.every(isValid);
      const validatedUrls: string[] = [];

      !allUrlsAreValid
        ? regexValue.forEach((validatedUrlValue) => {
            validatedUrlValue.isValid !== true &&
              displayAlert(`${validatedUrlValue.url} is not valid`, "danger");
          })
        : regexValue.forEach((validatedUrlValue) => {
            validatedUrls.push(validatedUrlValue.url);
            displayAlert("...Scraping your Urls", "success");
          });

      console.log(validatedUrls);
      validatedUrls.length > 0 &&
        postArticlesFromUrls(validatedUrls, descValue);
    } else {
      return;
    }

    // validate that all the inputs are URLS. (maybe through front and backend with express validator)
  };
  return (
    <Wrapper>
      <h2>Links to Scrape</h2>
      {showAlert && <Alert />}
      {isLoading && <LoadingSpinner />}
      <form onSubmit={submitHandler} className="articles-form">
        <div className="articles-input-container">
          <label htmlFor="description" className="description-label">
            Description. Provide a mini description to help you recall today's
            scrape.
          </label>
          <input
            id="description"
            name="description"
            className="description-input"
            ref={descriptionRef}
          />
          <label htmlFor="urls" className="input-label">
            Input all URLs into field. Please seperate links with a space.
          </label>
          <textarea id="urls" name="urls" className="url-input" ref={urlsRef} />
        </div>
        <button disabled={isLoading}  className="btn" type="submit">
          Scrape all
        </button>
      </form>
      {/* show loading once clicked, once submit succeeds,show button for 
      to THAT scraped version.  */}
      <ScrapeOverview />
    </Wrapper>
  );
};


export default ScrapeForm;
