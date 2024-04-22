import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserSpots } from "../../store/spots";
import DeleteSpotModal from "../DeleteSpotModal/DeleteSpotModal";
import OpenModalButton from '../OpenModalButton';
import { IoStar } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import styles from './ManageSpots.module.css';

const ManageSpots = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spotsList = Object.values(useSelector(state => state.spots));
  const sessionUser = useSelector(state => state.session.user);
  const userSpots = spotsList.filter((spot) => spot.ownerId === sessionUser.id);
  const sortedUserSpots = userSpots.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  useEffect(() => {
    dispatch(fetchUserSpots());
  }, [dispatch, sessionUser.id]);

  return (
    <div className={styles.spotsWrapper}>
      <h1>Manage Spots</h1>
      {sortedUserSpots.length > 0 ? (
        <div className={styles.grid}>
          {sortedUserSpots.map(({ city, state, avgStarRating, previewImage, price, id, name }) => (
            <div key={id} className={styles.spotWrapper}>
              <NavLink to={`/spots/${id}`} className={styles.spotLink}>
                <div className={styles.spot} title={name}>
                  <img className={styles.spotImg} src={previewImage} alt="Spot image" />
                  <div className={styles.spotInfo}>
                    <div className={styles.spotLocRating}>
                      <h3 className={styles.spotLocation}>{city}, {state}</h3>
                      <h3 className={styles.spotRating}><IoStar className={styles.starIcon} />{avgStarRating ? avgStarRating.toFixed(1) : "New"}</h3>
                    </div>
                    <h3 className={styles.spotPrice}>${price} per night</h3>
                  </div>
                </div>
              </NavLink>
              <div className={styles.spotActions}>
                <button
                  className={styles.updateBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/spots/${id}/edit`);
                  }}
                >
                  Update
                </button>
                <OpenModalButton
                  className={styles.deleteBtn}
                  buttonText="Delete"
                  modalComponent={<DeleteSpotModal spotId={id} />}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <NavLink to="/spots/new" className={styles.newSpotLink}>
          Create a New Spot
        </NavLink>
      )}
    </div>
  );
};

export default ManageSpots;


