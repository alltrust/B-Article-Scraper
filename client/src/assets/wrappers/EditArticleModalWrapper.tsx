import styled from "styled-components";

const EditArticleModalWrapper = styled.div`
  background-color: var(--primary-600);
  position: absolute;
  margin: auto;
  padding: 20px;
  left: 0;
  right: 0;
  top: 30%;
  width: 75%;
  min-height: 12rem;
  border-radius: 10px;

  .heading-body-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    justify-content: space-between;
  }
  .heading-body-container > input,
  .heading-body-container > textarea {
    border: none;
    border-radius: 5px;
    padding:5px
  }
  textarea{
    min-height:10rem;
  }
  .close-button {
    position: absolute;
    right: 0;
    background-color: transparent;
    color: white;
    border: none;
    top: 0;
    margin-right: 5px;
    margin-top: 5px;
    transition: var(--transition);
  }
  .close-button:hover {
    cursor: pointer;
    transition: var(--transition);
    transform:scale(1.2);
    border: 1px solid white;
    border-radius: 100px;
    background-color: white;
    color: black;
  }
  a {
    text-decoration: none;
    color: white;
  }
  a:hover {
    text-decoration: underline;
  }
`;

export default EditArticleModalWrapper;
