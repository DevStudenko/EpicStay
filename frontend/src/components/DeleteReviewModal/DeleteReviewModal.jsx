import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteReview } from '../../store/reviews';
import styles from './DeleteReviewModal.module.css'; // Ensure CSS module is correctly referenced

const DeleteReviewModal = ({ reviewId, spotId }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = () => {
        dispatch(deleteReview(reviewId, spotId))
            .then(() => closeModal())
            .catch((error) => console.error('Error deleting review:', error));
    };

    return (
        <div className={styles.modal}>
            <h1 className={styles.header}>Confirm Delete</h1>
            <p>Are you sure you want to delete this review?</p>
            <button className={styles.button} onClick={handleDelete}>Yes (Delete Review)</button>
            <button className={styles.button_no} onClick={closeModal}>No (Keep Review)</button>
        </div>
    );
}

export default DeleteReviewModal;
