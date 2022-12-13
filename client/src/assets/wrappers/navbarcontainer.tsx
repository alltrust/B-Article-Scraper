import styled from "styled-components";

const navbarContainer = styled.aside`
  .primary-nav,
  .nav-link {
    font-size: 18px;
    margin: 10px;
    border-radius: 5px;
    padding: 10px;
    text-align:center;
    width: 100%;
    transition: var(--transition);

  }
  .nav-link:hover{
    background:linear-gradient(to right, rgba(190, 253, 190,0), rgba(190, 253, 190,1));
    color: var(--white);
    padding: 10px;
    transition: var(--transition);

  }
  .active {
    background: linear-gradient(to right, rgba(44, 188, 152, 0), rgba(44, 188, 152, 1));
    transition: var(--transition);
    color: var(--white);
    padding: 10px;
  }
  min-width: 12rem;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--primary-50);
  padding: 20px;
  border: none;
  box-shadow: 5px;
  /* box-shadow: 1px 0px 0px 0px rgba(var(--primary-100), 0.5); */
`;

export default navbarContainer;
