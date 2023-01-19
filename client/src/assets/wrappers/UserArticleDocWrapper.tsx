import styled from "styled-components";

const UserArticleDocWrapper = styled.div`
.article-content-delete-container{
  display: flex;
  flex-direction: column;
}
  .icons-container {
    display: flex;
    justify-content: flex-start;
  }

  .user-article-container {
    background-color: var(--primary-900);
    color: white;
    width: 100%;
    margin-top: 15px;
    border-radius: 5px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: var(--transition);
  }
  .user-article-container:hover {
    background-color: white;
    color: var(--primary-900);
    transition: var(--transition);
  }
  .react-icon {
    transform: scale(1.5);
    margin: 10px;
    transition: var(--transition);
  }
  .react-icon:hover{
    cursor: pointer;
    transform: scale(1.75);
    transition: var(--transition);
  }

  .trash-icon:hover {
    transition: var(--transition);
    color: var(--red-dark);
  }
  .article-description {
    /* margin-right: auto; */
    cursor: pointer;
    text-align: center;
    width: 100%;
  }

  .preview-nav-link{
    color: var(--primary-400)
  }

`;

export default UserArticleDocWrapper;
