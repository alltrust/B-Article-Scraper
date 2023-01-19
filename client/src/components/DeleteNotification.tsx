import DeleteNotificationWrapper from "../assets/wrappers/DeleteNotificationWrapper";
import { useAppContext } from "../context/appContext";

interface IDeleteNotification {
  toggleDelete: () => void;
  border: string;
  deleteText: string;
  docId:string;
  articleId?:string
}

const DeleteNotification = ({
  toggleDelete,
  border,
  deleteText,
  docId,
  articleId
}: IDeleteNotification) => {
  const {deleteArticleOrDoc}= useAppContext()

  const deleteTarget = ()=>{
    deleteArticleOrDoc(docId, articleId)
  }
  return (
    <DeleteNotificationWrapper border={border} className="delete-bar-container">
      <p>{deleteText}</p>
      <div className="buttons-container">
        <button className="btn btn-danger" onClick={deleteTarget}>Delete</button>
        <button className="btn btn-success" onClick={toggleDelete}>
          Cancel
        </button>
      </div>
    </DeleteNotificationWrapper>
  );
};

export default DeleteNotification;
