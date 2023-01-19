import styled, { keyframes } from "styled-components";

interface ISingleArticleWrapper {
  backgroundColor: string;
}
const fadeIn = keyframes`
    0% { opacity:0.25 }
 30% {  opacity: 0.5 }
 40% { opacity: 0.8; }
`;

const SingleArticleWrapper = styled.div<ISingleArticleWrapper>`
  .single-article-container {
    background-color: ${(props) => props.backgroundColor};
    color: ${(props) => props.color};
    width: 100%;
    opacity: 0.8;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    border: 1px solid white;
    padding: 5px;
    border-radius: 5px;
    transition: var(--transition);
    animation-name: ${fadeIn};
    animation-duration: 0.5s;
  }

  

  .single-article-container:hover {
    opacity: 0.7;
    transition: var(--transition);
  }

  .icons-container{
    position:sticky;
    top: 0;
  }

  .action-icon {
    cursor: pointer;
    transition: var(--transition);
    color: black;
    margin: 10px;
    transform: scale(1.5);
  }

  .action-icon:hover{
    transition: var(--transition);
    color: white;
    transform: scale(1.75);
  }
  .article-property{
    display: flex;
    align-items: baseline;
    border-bottom: 1px solid black;
  }

  h5{
    margin-right: 5px;
  }

  .article-content {
    display: flex;
    flex-direction: column;
    width: inherit;
  }
`;

export default SingleArticleWrapper;
