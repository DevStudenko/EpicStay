import { csrfFetch } from './csrf';

const GET_ALL_SPOTS = 'spots/getAllSpots';
const GET_SPOT_DETAILS = 'spots/getSpotDetails';


const getAllSpots = (spots) => {
    return {
        type: GET_ALL_SPOTS,
        payload: spots
    }
}

const getSpotDetails = (spot) => {
    return {
        type: GET_SPOT_DETAILS,
        payload: spot
    };
};

export const populateSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots', {
        method: 'GET'
    });
    if (response.ok) {
        const data = await response.json();

        dispatch(getAllSpots(data));
    }
}

export const fetchSpotDetails = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'GET'
    });
    if (response.ok) {
        const data = await response.json();
        console.log('*****************Spot DETAILS DATA ' + data);
        dispatch(getSpotDetails(data));
    }
};

const initialState = {}

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_SPOTS: {
            const newState = {};
            action.payload.Spots.forEach(spot => {
                newState[spot.id] = spot;
            });
            return {
                ...state,
                ...newState
            };
        }
        case GET_SPOT_DETAILS: {
            const updatedSpot = { ...state[action.payload.id], ...action.payload };

            return {
                ...state,
                [action.payload.id]: updatedSpot
            }
        }

        default:
            return state;
    }
};


export default spotsReducer