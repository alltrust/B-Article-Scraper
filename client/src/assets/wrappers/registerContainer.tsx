import styled from "styled-components";

const registerContainer = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  .form {
    max-width: 500px;
    background-color: #f8faf8;
  }
  .label-input-container {
    display: flex;
    flex-direction: column;
    padding-top: 20px;
  }
  .label-input-container > label {
    color: #918d8d;
  }
  .label-input-container > input {
    border: none;
    background-color: transparent;
    border-bottom: grey 1px solid;
    min-height: 30px;
    outline: none;
  }

  .form > button {
    width: 100%;
    margin-top: 20px;
    padding: 10px;
  }
`;

export default registerContainer;
