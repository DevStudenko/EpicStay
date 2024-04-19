import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegStar } from 'react-icons/fa';
import { createReview } from '../../store/reviews';
import './CreateReview.css';

const HandleInput = ({ rating, setRating }) => {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="rating-input">
            {stars.map((star, index) => (
                <FaRegStar
                    key={index}
                    size={30}
                    color={rating >= star ? 'yellow' : 'grey'}
                    onClick={() => setRating(star)}
                />
            ))}
            <label>Stars</label>
        </div>
    );
};

const CreateReviewModal = ({ spotId, closeModal }) => {
    const dispatch = useDispatch();
    const [reviewBody, setReviewBody] = useState('');
    const [rating, setRating] = useState(0);
    const [serverError, setServerError] = useState('');
    const [disabled, setDisabled] = useState(true);
    const sessionUser = useSelector((state) => state.session.user);

    useEffect(() => {
        setDisabled(rating === 0 || reviewBody.length < 10);
    }, [rating, reviewBody]);

    const resetModal = () => {
        setReviewBody('');
        setRating(0);
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
        } catch (res) {
            const data = await res.json();
            if (data && data.message) {
                setServerError(data.message);
            }
        }
    };

    return (
        <div className='review-modal-container'>
            <h2>How was your stay?</h2>
            {serverError && <p className="error-message">Server Error: {serverError}</p>}

            <textarea
                placeholder="Leave your review here..."
                value={reviewBody}
                onChange={e => setReviewBody(e.target.value)}
            />

            <HandleInput
                rating={rating}
                setRating={setRating}
            />

            <button disabled={disabled} onClick={handleSubmit}>
                Submit Your Review
            </button>
        </div>
    );
};

export default CreateReviewModal;
