import styled from "styled-components";

const ScrapeOverviewWrapper = styled.section`
  width: 75%;
  border: black;
  border-radius: 5px;
  .all-content-container {
    border-radius: 10px;
    text-align: center;
  }
  
  .articles-container {
    width: 50%;
    padding: 10px;
    border-radius: 10px;
    background-color: var(--primary-50);
  }
 
  .overview-edit-container{
    display: flex;
  }
`;

export default ScrapeOverviewWrapper;
