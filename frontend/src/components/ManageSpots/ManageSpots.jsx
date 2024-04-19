import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserSpots } from "../../store/spots";
import DeleteSpotModal from "../DeleteSpotModal/DeleteSpotModal";
import OpenModalButton from '../OpenModalButton';
import { IoStar } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";


import './ManageSpots.css';

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
    <div className="spots-wrapper">
      <h1>Manage Spots</h1>
      <div className='spots-container'>
        {sessionUser && sortedUserSpots.length ?
          sortedUserSpots.map(({ city, state, avgStarRating, previewImage, price, id, name }) => (
            <div className='spot-wrapper' key={id}>
              <NavLink to={`/spots/${id}`} className='spot-link'>
                <div className='spot' title={name}>
                  <img src={previewImage} alt="spotImage" />
                  <div className='spot-info'>
                    <div className='spot-loc-rating'>
                      <h3 className='spot-location'>{city}, {state}</h3>
                      <h3 className='spot-rating'><IoStar className='star-icon' />{avgStarRating ? avgStarRating.toFixed(1) : "New"}</h3>
                    </div>
                    <h3 className='spot-price'>${price} night</h3>
                  </div>
                </div>
              </NavLink>
              <div className="manage-spot-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/spots/${id}/edit`);
                  }}
                >
                  Update
                </button>
                <OpenModalButton
                  buttonText="Delete"
                  modalComponent={<DeleteSpotModal spotId={id} />}
                />
              </div>
            </div>
          )) :
          <NavLink to="/spots/new" className="create-new-spot-link">
            Create a New Spot
          </NavLink>}
      </div>
    </div>
  );
};

export default ManageSpots;

