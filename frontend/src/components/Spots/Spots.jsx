import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSpots } from '../../store/spots';
import { IoStar } from "react-icons/io5";
import { NavLink } from 'react-router-dom';
import styles from './Spots.module.css';

const Spots = () => {
    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots);
    const spotsList = Object.values(spots).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    useEffect(() => {
        dispatch(fetchAllSpots());
    }, [dispatch]);

    return (
        <div className={styles.grid}>
            {spotsList?.map(({ city, state, avgStarRating, previewImage, price, id, name }) => (
                <NavLink to={`/spots/${id}`} key={id} className={styles.spotLink}>
                    <div className={styles.spot} title={name}>
                        <img src={previewImage} alt="spot image" className={styles.spotImg} />
                        <div className={styles.spotInfo}>
                            <div className={styles.spotLocRating}>
                                <h3 className={styles.spotLocation}>{city}, {state}</h3>
                                <h3 className={styles.spotRating}><IoStar className={styles.starIcon} />{avgStarRating ? avgStarRating.toFixed(1) : "New"}</h3>
                            </div>
                            <h3 className={styles.spotPrice}>${price} per night</h3>
                        </div>
                    </div>
                </NavLink>
            ))}
        </div>
    );
}

export default Spots;
