import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
// import { fetchSpotDetails } from '../../store/spots';
import { IoStar } from 'react-icons/io5';
import './SpotDetail.css';

const SpotDetail = () => {
    const { spotId } = useParams();
    console.log('***************This is inside of SPOT DETAIL!!!!!!!!')
    console.log('Spot id is: ' + spotId);
    console.log(typeof (spotId));

    // const dispatch = useDispatch();

    console.log(typeof (useEffect));
    useEffect(() => {
        console.log('*************Inside the useEffect')
        // dispatch(fetchSpotDetails(spotId));
    });

    // const reduxState = useSelector(state => state);
    const spot = useSelector(state => state.spots[spotId]);
    // console.log("************Redux State:", reduxState);
    console.log('***********This is a SPOOOOOT!!!!!!!!!!!!', spot)
    return (
        <div className="spot-detail">
            <h1>{spot.name}</h1>
            <div>Location: {spot.city}, {spot.state}, {spot.country}</div>
            <div className="spot-images">
                {spot.SpotImages.map((image, index) => (
                    <img key={index} src={image.url} alt={`Spot Image ${index + 1}`} className={index === 0 ? 'main-image' : 'small-image'} />
                ))}
            </div>
            <div>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</div>
            <p>{spot.description}</p>
            <div className="callout-info">
                <div className="callout-price">
                    <span className="price">{"$" + spot.price.toFixed(2)}</span>
                    <span className="per-night">night</span>
                </div>
                <div className="callout-rating">
                    <IoStar className="star-icon" />
                    <span className="rating">{spot.avgStarRating ? spot.avgStarRating.toFixed(1) : "New"}</span>
                    <span className="num-reviews">{spot.numReviews ? spot.numReviews + " reviews" : "No reviews"}</span>
                </div>
                <button className="reserve-button">Reserve</button>
            </div>

        </div>
    );
};

export default SpotDetail;
