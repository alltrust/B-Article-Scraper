import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
    0% { opacity:0.25 }
 30% {  opacity: 0.5 }
 40% { opacity: 0.8; }
`;
const SingleArticleWrapper = styled.div`
  .single-article-container {
    background-color: var(--primary-500);
    color: white;
    width: 100%;
    opacity: 0.8;
    display: flex;
    align-items: center;
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
  .action-icon{
    cursor: pointer;
    transition: var(--transition);
    color: black;
    margin:10px;
    transform: scale(1.5)

  }
 
  .article-content {
    display: flex;
    flex-direction: column;
  } 
`;

export default SingleArticleWrapper;
