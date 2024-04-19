
const DeleteSpotModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-container">
      <div className="modal">
        <h2>{title}</h2>
        <p>{message}</p>
        <button className="red-button" onClick={onConfirm}>Yes (Delete Spot)</button>
        <button className="grey-button" onClick={onClose}>No (Keep Spot)</button>
      </div>
    </div>
  );
}


export default DeleteSpotModal