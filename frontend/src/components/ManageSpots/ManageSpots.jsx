import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserSpots, deleteSpot } from "../../store/spots";
import { NavLink, useNavigate } from "react-router-dom";
import { IoStar } from "react-icons/io5";

import './ManageSpots.css';

const ManageSpots = () => {
    const dispatch = useDispatch();
    const spotsList = Object.values(useSelector(state => (state.spots)));
    const sessionUser = useSelector(state => state.session.user)
    const userSpots = spotsList.filter((spot) => spot.ownerId === sessionUser.id)
    return (
    
  )
}

export default ManageSpots