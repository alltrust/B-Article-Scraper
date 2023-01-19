import styled from "styled-components";

const SingleArticleParagraphsWrapper = styled.div`
  .sentence{
    transition: var(--transition);
    padding:5px
  }

  .sentence:hover{
    background-color: var(--primary-700);
    transition: var(--transition);
    cursor: pointer;
  }

  .selected{
    background-color: var(--primary-700);
  }
`;

export default SingleArticleParagraphsWrapper;
