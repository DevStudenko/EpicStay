import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { populateSpots } from '../../store/spots';
import { IoStar } from "react-icons/io5";
import './Spots.css'

const Spots = () => {
    const dispatch = useDispatch();
    const spots = useSelector(state => (state.spots));
    const spotsList = Object.values(spots);

    useEffect(() => {
        dispatch(populateSpots())
    }, [dispatch])

    return (
        <div className='spot-grid'>
            {spotsList?.map(({ city, state, avgStarRating, previewImage, price, id }) => (
                <div className='spot' key={id}>
                    <img src={previewImage} alt="spotImage" />
                    <div className='spot-info'>
                        <div className='spot-loc-rating'>
                            <h3 className='spot-location'>{city}, {state}</h3>
                            <h3 className='spot-rating'><IoStar />{avgStarRating ? avgStarRating : 'New'}</h3>
                        </div>
                        <h3 className='spot-price'>${price}</h3>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Spots