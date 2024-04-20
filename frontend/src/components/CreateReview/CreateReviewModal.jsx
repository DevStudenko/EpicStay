import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { createReview } from '../../store/reviews';
import styles from './CreateReview.module.css'; // Assuming you have CSS module for styling


const HandleInput = ({ rating, setRating, userHover, setUserHover }) => {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className={styles.ratingInput}>
            {stars.map(star => (
                <div
                    key={star}
                    onMouseEnter={() => setUserHover(star)}
                    onMouseLeave={() => setUserHover(0)}
                    onClick={() => setRating(star)}
                    className={styles.starContainer}
                >
                    {(userHover >= star || (!userHover && rating >= star)) ? (
                        <FaStar size={30} className={styles.star} style={{ color: 'yellow' }} />
                    ) : (
                        <FaRegStar size={30} className={styles.star} style={{ color: 'grey' }} />
                    )}
                </div>
            ))}
        </div>
    );
};


const CreateReviewModal = ({ spotId, closeModal }) => {
    const dispatch = useDispatch();
    const [reviewBody, setReviewBody] = useState('');
    const [rating, setRating] = useState(0);
    const [userHover, setUserHover] = useState(0);
    const [serverError, setServerError] = useState('');
    const [disabled, setDisabled] = useState(true);
    const sessionUser = useSelector((state) => state.session.user);

    useEffect(() => {
        setDisabled(rating === 0 || reviewBody.length < 10);
    }, [rating, reviewBody]);

    const resetModal = () => {
        setReviewBody('');
        setRating(0);
        setUserHover(0);
        setServerError('');
        setDisabled(true);
        closeModal();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(createReview({
                review: reviewBody,
                stars: rating,
                spotId,
                user: sessionUser
            }));
            resetModal();
        } catch (err) {
            console.error(err);
            setServerError(err.message || 'An error occurred');
        }
    };

    return (
        <div className={styles.modalContainer}>
            <h2 className={styles.modalTitle}>How was your stay?</h2>
            {serverError && <p className={styles.errorMessage}>Server Error: {serverError}</p>}
            <textarea
                className={styles.reviewInput}
                placeholder="Leave your review here..."
                value={reviewBody}
                onChange={e => setReviewBody(e.target.value)}
                rows={5}
            />
            <HandleInput
                rating={rating}
                setRating={setRating}
                userHover={userHover}
                setUserHover={setUserHover}
            />
            <button
                className={styles.submitButton}
                disabled={disabled}
                onClick={handleSubmit}
            >
                Submit Your Review
            </button>
        </div>
    );
};

export default CreateReviewModal;


