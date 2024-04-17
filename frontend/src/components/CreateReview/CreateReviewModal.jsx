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
    const [errors, setErrors] = useState({});
    const [disabled, setDisabled] = useState(true);
    const sessionUser = useSelector((state) => state.session.user);

    useEffect(() => {
        if (rating === 0 || reviewBody.length < 10) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }, [rating, reviewBody]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!rating) {
            return setErrors({ rating: 'Please provide a star rating' });
        }

        if (reviewBody.length < 10) {
            return setErrors({ review: 'Review text must be greater than ten characters' });
        }

        try {
            await dispatch(createReview({
                review: reviewBody,
                stars: rating,
                spotId,
                userId: sessionUser.id
            }));
            closeModal();
        } catch (res) {
            const data = await res.json();
            if (data && data.errors) setErrors(data.errors);
        }
    };

    const isValid = Object.keys(errors).length === 0;

    return (
        <div className='review-modal-container'>
            <h2>How was your stay?</h2>
            {errors.review && <p>{errors.review}</p>}
            {errors.rating && <p>{errors.rating}</p>}

            <textarea
                placeholder="Leave your review here..."
                value={reviewBody}
                onChange={e => setReviewBody(e.target.value)}
            />

            <HandleInput
                rating={rating}
                setRating={setRating}
            />

            <button disabled={disabled || !isValid} onClick={handleSubmit}>
                Submit Your Review
            </button>
        </div>
    );
};

export default CreateReviewModal;
