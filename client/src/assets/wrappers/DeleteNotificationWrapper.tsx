import styled from "styled-components";

interface IDeleteNotificationWrapper {
  border: string;
}

const DeleteNotificationWrapper = styled.div<IDeleteNotificationWrapper>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
  width: 100%;
  border: 2px solid ${(props) => props.border};
  border-top: none;
  border-radius: 5px;
  padding-left: 10px;
  padding-right: 10px;
  p{
    color: var(--red-dark);
    font-weight: 500;
  }
  .buttons-container>.btn{
    margin: 3px;
  }
`;

export default DeleteNotificationWrapper;
