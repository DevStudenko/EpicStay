import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchSpotDetails } from '../../store/spots';
import { IoStar } from 'react-icons/io5';
import './SpotDetail.css';

const SpotDetail = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots[spotId]);

    useEffect(() => {
        dispatch(fetchSpotDetails(spotId));
    }, [spotId, dispatch]);

    if (!spot || !spot.SpotImages) return <h1>Loading...</h1>;

    return (
        <div className="spot-detail">
            <h1 className="spot-name">{spot.name}</h1>
            <div className="location-info">Location: {spot.city}, {spot.state}, {spot.country}</div>
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
            <div className="spot-info">
                <div className="host-info">Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</div>
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
                <button className="reserve-button">Reserve</button>
            </div>
        </div>
    );
};

export default SpotDetail;

