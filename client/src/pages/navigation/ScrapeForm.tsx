import { FormEvent, useRef } from "react";
import { useAppContext } from "../../context/appContext";
import Wrapper from "../../assets/wrappers/ScrapeFormWrapper";
import { Alert } from "../../components";

const ScrapeForm = () => {
  const { postArticlesFromUrls, displayAlert, clearAlert, showAlert } =
    useAppContext();

  const urlsRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    const urlsValue = urlsRef.current?.value;
    const descValue = descriptionRef.current?.value
    
    if (urlsValue?.trim() === "") {
      const alertmsg: string = "Please insert a valid URL";
      displayAlert(alertmsg, 'danger');
      clearAlert()
      return
    }
    if (urlsValue !== undefined && descValue !== undefined) {
      let cleanedURLS = urlsValue.replace(/,+/g, "")
      postArticlesFromUrls(cleanedURLS, descValue);
      console.log(urlsValue);
    }else{
      return
    }
    // validate that all the inputs are URLS. (maybe through front and backend with express validator)
  };
  return (
    <Wrapper>
      <h2>Links to Scrape</h2>
      {showAlert && <Alert/>}
      <form onSubmit={submitHandler} className="articles-form">
        <div className="articles-input-container">
          <label htmlFor="description" className="description-label">Description. Provide a mini description to help you recall today's scrape.</label>
          <input id="description" name="description" className="description-input" ref={descriptionRef}/>
          <label htmlFor="urls" className="input-label">
            Input all URLs into field. Please seperate links with a space.
          </label>
          <textarea
            id="urls"
            name="urls"
            className="url-input"
            ref={urlsRef}
          />
        </div>
        <button className="btn" type="submit">
          Scrape all
        </button>
      </form>
      {/* show loading once clicked, once submit succeeds,show button for 
      to THAT scraped version.  */}
    </Wrapper>
  );
};

export default ScrapeForm;
