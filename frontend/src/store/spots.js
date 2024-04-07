import { csrfFetch } from './csrf';

const GET_ALL_SPOTS = 'spots/getAllSpots'


const getAllSpots = (spots) => {
    return {
        type: GET_ALL_SPOTS,
        payload: spots
    }
}

export const populateSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots', {
        method: 'GET'
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(getAllSpots(data));
    }

}

const initialState = {}

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_SPOTS: {
            const newState = {};
            action.payload.Spots.forEach(spot => {
                newState[spot.id] = spot
            });
            return {
                ...state,
                ...newState
            }
        }
        default: return state;
    }
}

export default spotsReducer