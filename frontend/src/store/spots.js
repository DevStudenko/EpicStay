import { csrfFetch } from './csrf';

const GET_ALL_SPOTS = 'spots/GET_ALL_SPOTS';
const GET_SPOT_DETAILS = 'spots/GET_SPOT_DETAILS';
const ADD_NEW_SPOT = 'spots/ADD_NEW_SPOT';
const ADD_IMAGE_TO_SPOT = 'spots/ADD_IMAGE_TO_SPOT';
const GET_USER_SPOTS = 'spots/GET_USER_SPOTS';
const UPDATE_USER_SPOT = 'spots/UPDATE_USER_SPOT';
const DELETE_USER_SPOT = 'spots/DELETE_USER_SPOT';

const populateAllSpots = (spots) => {
    return {
        type: GET_ALL_SPOTS,
        payload: spots
    }
}

const populateSpotDetails = (spot) => {
    return {
        type: GET_SPOT_DETAILS,
        payload: spot
    };
};

const addNewSpot = (spot) => ({
    type: ADD_NEW_SPOT,
    payload: spot
});

const populateUserSpots = (spots) => ({
    type: GET_USER_SPOTS,
    payload: spots
})

const addImageToSpotAction = (spotId, image) => ({
    type: ADD_IMAGE_TO_SPOT,
    payload: { spotId, image },
});

export const fetchAllSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots', {
        method: 'GET'
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(populateAllSpots(data));
    }
}

export const fetchUserSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots/current');
    if (response.ok) {
        const data = await response.json();

        dispatch(populateUserSpots(data.Spots));
    }
}

export const fetchSpotDetails = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'GET'
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(populateSpotDetails(data));
    }
};

export const createSpot = (spotData) => async (dispatch) => {

    const response = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(spotData),
    });

    if (!response.ok) {
        const errors = await response.json();
        throw new Error(errors);
    }

    const data = await response.json();

    dispatch(addNewSpot(data));
    return data;
};

// Thunk Action Creator for adding an image to a spot
export const addImageToSpot = (spotId, imageData) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(imageData),
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(addImageToSpotAction(spotId, data));
        return data;
    }
};

export const deleteSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, { method: 'DELETE' });

    dispatch({ type: DELETE_USER_SPOT, payload: spotId });
    return response
};

export const updateSpot = (spotId, spotData) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(spotData),
    });

    if (response.ok) {
        const updatedSpot = await response.json();
        dispatch(populateSpotDetails(updatedSpot));
        return updatedSpot;
    }
};

const initialState = {}

const spotsReducer = (state = initialState, action) => {
    let newState = {};
    let spotDetails = '';
    let spotId = '';
    let image = '';
    let spotToUpdate = '';
    let updatedSpotImages = '';

    switch (action.type) {
        case GET_ALL_SPOTS: {
            newState = {};
            action.payload.Spots.forEach(spot => {
                newState[spot.id] = spot;
            });
            return {
                ...state,
                ...newState
            };
        }
        case GET_SPOT_DETAILS: {
            spotDetails = action.payload;
            if (!spotDetails.previewImage && spotDetails.SpotImages && spotDetails.SpotImages.length) {
                const previewImg = spotDetails.SpotImages.find(img => img.preview === true);
                if (previewImg) {
                    spotDetails.previewImage = previewImg.url;
                }
            }

            return {
                ...state,
                [spotDetails.id]: spotDetails
            };
        }
        case ADD_NEW_SPOT: {
            return {
                ...state,
                [action.payload.id]: action.payload,
            };
        }

        case ADD_IMAGE_TO_SPOT: {
            spotId = action.payload.spotId;
            image = action.payload.image;
            spotToUpdate = state[spotId];
            updatedSpotImages = spotToUpdate.SpotImages ? [...spotToUpdate.SpotImages, image] : [image];

            // if the added image is marked as a preview
            if (image.preview) {
                spotToUpdate.previewImage = image.url;
            }

            return {
                ...state,
                [spotId]: {
                    ...spotToUpdate,
                    SpotImages: updatedSpotImages
                },
            };
        }
        case GET_USER_SPOTS: {
            newState = { ...state };
            action.payload.forEach(spot => {
                newState[spot.id] = spot;
            });
            return newState;
        }

        case UPDATE_USER_SPOT: {
            newState = { ...state };
            newState[action.spot.id] = action.spot;
            return newState;
        }

        case DELETE_USER_SPOT: {
            newState = { ...state };
            delete newState[action.payload];
            return newState;
        }

        default:
            return state;
    }
};

export default spotsReducer;




