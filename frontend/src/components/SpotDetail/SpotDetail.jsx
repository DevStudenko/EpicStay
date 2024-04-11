import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchSpotDetails } from '../../store/spots';
import { IoStar } from 'react-icons/io5';
import './SpotDetail.css';
import { fetchReviewsBySpotId } from '../../store/reviews';

const SpotDetail = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots[spotId]);
    const reviews = useSelector(state => state.reviews[spotId]);
    // console.log(reviews)
    useEffect(() => {
        dispatch(fetchSpotDetails(spotId));
        dispatch(fetchReviewsBySpotId(spotId))
    }, [spotId, dispatch]);

    if (!spot || !reviews || !spot.SpotImages) return <h1>Loading...</h1>;

    return (
        <div className="spot-detail">
            <div className="spot-heading">
                <h1 className="spot-name">{spot.name}</h1>
                <div className="location-info">{spot.city}, {spot.state}, {spot.country}</div>

            </div>
            <div className="spot-images">
                {spot.SpotImages.map((image, index) => (
                    <img
                        key={index}
                        src={image.url}
                        alt={`Spot Image ${index + 1}`}
                        className={image.preview === true ? 'main-image' : `small-image${index}`}
                    />
                ))}
            </div>
            <div className="spot-detail-info">
                <div className="spot-title">
                    <h3 className="host-info">Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h3>
                    <p className="spot-description">{spot.description}</p>
                </div>
                <div className="callout-info">
                    <div className="callout-price">
                        <span className="price">{"$" + spot.price.toFixed(2)}</span>
                        <span className="per-night">/ night</span>
                    </div>
                    <div className="callout-rating">
                        <IoStar className="star-icon" />
                        <span className="rating">{spot.avgStarRating ? spot.avgStarRating.toFixed(1) : "New"}</span>
                        <span className='divider'>.</span>
                        <span className="num-reviews">{spot.numReviews ? spot.numReviews + " reviews" : "No reviews yet"}</span>
                    </div>
                    <button className="reserve-button" onClick={() => alert('Feature Coming Soon')}>Reserve</button>
                </div>
            </div>

            <div className="reviews-section">
                <div className="review-rating">
                    <IoStar className="star-icon" />
                    <span className="rating">{spot.avgStarRating ? spot.avgStarRating.toFixed(1) : "New"}</span>
                    <span className='divider'>.</span>
                    <span className="num-reviews">{spot.numReviews ? spot.numReviews + " reviews" : "No reviews yet"}</span>
                </div>
                {reviews.map((review, index) => {
                    const createdAt = new Date(review.createdAt)
                    const monthName = createdAt.toLocaleString('default', { month: 'long' });

                    const year = createdAt.toLocaleString('default', { year: 'numeric' })

                    return (
                        <div key={index} className="review">
                            <div className="review-header">
                                <span className="review-user">{review.User.firstName}</span>
                            </div>
                            <h3 className='review-date'>{monthName} {year}</h3>
                            <p className="review-body">{review.review}</p>
                        </div>
                    )
                })}

                <div className="user-not-logged-in">
                    <div className="post-review-notice">
                        Please log in to post a review.
                    </div>
                </div>
            </div>

        </div>
    );
};

export default SpotDetail;

