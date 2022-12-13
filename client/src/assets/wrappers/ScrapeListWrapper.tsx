import styled from "styled-components";

const ScrapeListWrapper = styled.section`
display: flex;
.info-header {
    text-align: center;
  }
  p {
    margin: 0;
    text-align: center;
  }
  .missing-content-container {
    display: flex;
    flex-direction: row;
  }
  .articles-missing-info-container {
    width: 50%;
    background-color: #fafac8;
  }
  .articles-failed-container {
    width: 50%;
    background-color: #f3bdbd;
  }
  li > a {
    text-decoration: none;
    color: var(--primary-800);
    padding:8px;
  }
  li {
    width: 100%;
    transition: var(--transition);
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
  }
  .action-icon{
    margin-right: 5px;
    
  }
  .action-icon:hover{
    cursor: pointer;
    color: white;
  }
  li:hover {
    background-color: #b5e8ff;
    color: #f3bdbd;
    transition: var(--transition);
  }
  ul {
    align-items: center;
    justify-content: center;
    flex-direction: column;
    display: flex;
  }
    
`;

export default ScrapeListWrapper
