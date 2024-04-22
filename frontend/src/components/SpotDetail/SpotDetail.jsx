import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { IoStar } from 'react-icons/io5';
import CreateReviewModal from '../CreateReview';
import DeleteReviewModal from '../DeleteReviewModal';
import OpenModalButton from '../OpenModalButton';
import { useModal } from '../../context/Modal';
import styles from './SpotDetail.module.css';
import { fetchReviewsBySpotId } from '../../store/reviews';
import { fetchSpotDetails } from '../../store/spots';

const SpotDetail = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots[spotId]);
    const reviews = useSelector(state => state.reviews[spotId]);
    const sessionUser = useSelector(state => state.session.user);
    const isOwner = sessionUser && spot && (spot.ownerId === sessionUser.id);
    const userHasReviewed = sessionUser && Array.isArray(reviews) && reviews.some(review => review.userId === sessionUser.id);
    const { setModalContent, closeModal } = useModal();

    useEffect(() => {
        dispatch(fetchSpotDetails(spotId));
        dispatch(fetchReviewsBySpotId(spotId));
    }, [spotId, dispatch]);

    if (!spot || !reviews || !spot.SpotImages) return <h1 className={styles.loading}>Loading...</h1>;

    const sortedReviews = reviews.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const hasReviews = spot.numReviews > 0;
    const reviewCountText = hasReviews ? `${spot.numReviews} review${spot.numReviews > 1 ? 's' : ''}` : 'No reviews yet';

    const handlePostReviewClick = () => {
        setModalContent(
            <CreateReviewModal
                spotId={spotId}
                closeModal={closeModal}
            />
        );
    };

    return (
        <div className={styles.spotDetail}>
            <div className={styles.spotHeading}>
                <h1 className={styles.spotName}>{spot.name}</h1>
                <div className={styles.locationInfo}>{spot.city}, {spot.state}, {spot.country}</div>
            </div>
            <div className={`${styles.spotImages} ${spot.SpotImages.length === 1 ? styles.singleImage : ''} ${spot.SpotImages.length > 1 ? styles.multipleImages : ''}`}>
                {spot.SpotImages.length === 1 ? (
                    <div className={styles.mainImageHalf}>
                        <img src={spot.SpotImages[0].url} alt="Main Image" />
                    </div>
                ) : (
                    <>
                        <div className={styles.mainImage}>
                            <img src={spot.previewImage} alt="Main Image" />
                        </div>
                        {spot.SpotImages.length > 1 && (
                            <div className={styles.nestedGrid}>
                                {spot.SpotImages.slice(1).map((image, index) => (
                                    <img key={index} className={styles.smallImage} src={image.url} alt={`Image ${index + 2}`} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
            <div className={styles.spotDetailInfo}>
                <div className={styles.spotTitle}>
                    <h3 className={styles.hostInfo}>Hosted by {spot.Owner ? `${spot.Owner.firstName} ${spot.Owner.lastName}` : 'Unavailable'}</h3>
                    <p className={styles.spotDescription}>{spot.description}</p>
                </div>
                <div className={styles.calloutInfo}>
                    <div className={styles.calloutPrice}>
                        <span className={styles.price}>${spot.price.toFixed(2)}</span>
                        <span className={styles.perNight}>/ night</span>
                    </div>
                    <div className={styles.calloutRating}>
                        <IoStar className={styles.starIcon} />
                        <span className={styles.rating}>{spot.avgStarRating ? spot.avgStarRating.toFixed(1) : "New"}</span>
                        {hasReviews && (
                            <>
                                <span className={styles.divider}>.</span>
                                <span className={styles.numReviews}>{reviewCountText}</span>
                            </>
                        )}
                    </div>
                    <button className={styles.reserveButton} onClick={() => alert('Feature Coming Soon')}>Reserve</button>
                </div>
            </div>

            <div className={styles.reviewsSection}>
                {hasReviews ? (
                    <>
                        <div className={styles.reviewRating}>
                            <IoStar className={styles.starIcon} />
                            <span className={styles.rating}>{spot.avgStarRating ? spot.avgStarRating.toFixed(1) : "New"}</span>
                            <span className={styles.divider}>.</span>
                            <span className={styles.numReviews}>{reviewCountText}</span>
                        </div>

                        {sessionUser && !isOwner && !userHasReviewed && (
                            <button className={styles.reviewButton} onClick={handlePostReviewClick}>
                                Post Your Review
                            </button>
                        )}

                        {sortedReviews.map((review, index) => {
                            const createdAt = new Date(review.createdAt);
                            const monthName = createdAt.toLocaleString('default', { month: 'long' });
                            const year = createdAt.toLocaleString('default', { year: 'numeric' });

                            return (
                                <div key={index} className={styles.review}>
                                    <div className={styles.reviewHeader}>
                                        <span className={styles.reviewUser}>{review.User?.firstName}</span>
                                    </div>
                                    <h3 className={styles.reviewDate}>{monthName} {year}</h3>
                                    <p className={styles.reviewBody}>{review.review}</p>
                                    {review.userId === sessionUser?.id && (
                                        <OpenModalButton
                                            className={styles.deleteReviewBtn}
                                            buttonText="Delete"
                                            modalComponent={<DeleteReviewModal spotId={spotId} reviewId={review.id} />}
                                        />
                                    )}
                                </div>
                            )
                        })}
                    </>
                ) : (
                    <div className={styles.noReviews}>
                        <IoStar className={styles.starIcon} />
                        <span className={styles.rating}>New</span>

                        {!sessionUser ?
                            (<div className={styles.postReviewNotice}>
                                Please log in to post a review.
                            </div>) : (
                                <>
                                    {!isOwner ? (
                                        <div className={styles.postReviewAction}>
                                            <button className={styles.reviewButton} onClick={handlePostReviewClick}>
                                                Post Your Review
                                            </button>
                                            <p className={styles.firstReviewMessage}>Be the first to post a review!</p>
                                        </div>
                                    ) : null}
                                </>
                            )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpotDetail;




