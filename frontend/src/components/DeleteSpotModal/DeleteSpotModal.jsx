import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteSpot } from '../../store/spots';
import styles from './DeleteSpotModal.module.css'


const DeleteSpotModal = ({ spotId }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = () => {
    dispatch(deleteSpot(spotId))
      .then(closeModal);
  };

  return (
    <div className={styles.modal}>
      <h1 className={styles.header}>Confirm Delete</h1>
      <p>Are you sure that you want to remove this spot from the listings?</p>
      <button className={styles.button} onClick={handleDelete}>Yes (Delete Spot)</button>
      <button className={styles.button_no} onClick={closeModal}>No (Keep Spot)</button>
    </div>
  );
};

export default DeleteSpotModal;
