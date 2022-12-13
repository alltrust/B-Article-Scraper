import styled from "styled-components";

const UserArticleDocWrapper = styled.div`


  .user-article-container {
    background-color: var(--primary-900);
    color: white;
    width: 100%;
    margin-top: 15px;
    border-radius: 5px;
    height: 40px;
    display: flex;
    align-items: center;
    transition: var(--transition);
  }
  .user-article-container:hover {
    cursor: pointer;
    background-color: white;
    color: var(--primary-900);
    transition: var(--transition);
  }
  .react-icon {
    transform: scale(1.5);
    margin-right: auto;
    margin-left: 20px;
  }
  .article-description {
    margin-right: auto;
  }
`;

export default UserArticleDocWrapper;
