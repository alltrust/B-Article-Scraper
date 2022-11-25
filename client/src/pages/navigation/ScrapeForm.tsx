import { FormEvent, useRef } from "react";
import { useAppContext } from "../../context/appContext";
import Wrapper from "../../assets/wrappers/ScrapeFormWrapper";
import { Alert } from "../../components";

const ScrapeForm = () => {
  const { postArticlesFromUrls, displayAlert, clearAlert, showAlert } =
    useAppContext();
  // make request to the server with the urls provided in the value of the inputs

  const urlsRef = useRef<HTMLTextAreaElement>(null);

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    // if(urlsRef.current !== null){
    const urlsValue = urlsRef.current?.value;
    // }
    //check for urls validity and ensure it is url
    if (urlsValue?.trim() === "") {
      const alertmsg: string = "Please insert a valid URL";
      displayAlert(alertmsg, 'danger');
      clearAlert()
    }
    // if(urlsRef ){
    if (urlsValue !== undefined && urlsValue !== "") {
      postArticlesFromUrls(urlsValue);
      console.log(urlsValue);
    }else{
      return
    }
    // }
    // validate that all the inputs are URLS. (maybe through front and backend with express validator)
  };
  return (
    <Wrapper>
      <h2>Links to Scrape</h2>
      {showAlert && <Alert/>}
      <form onSubmit={submitHandler} className="articles-form">
        <div className="articles-input-container">
          <label htmlFor="urls" className="input-label">
            Input all URLs into field. Please seperate links with a space.
          </label>
          <textarea
            id="urls"
            name="urls"
            className="url-input"
            ref={urlsRef}
          ></textarea>
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
