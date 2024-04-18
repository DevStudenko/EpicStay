import { csrfFetch } from './csrf';

const GET_ALL_SPOTS = 'spots/GET_ALL_SPOTS';
const GET_SPOT_DETAILS = 'spots/GET_SPOT_DETAILS';
const ADD_NEW_SPOT = 'spots/ADD_NEW_SPOT';
const ADD_IMAGE_TO_SPOT = 'spots/ADD_IMAGE_TO_SPOT';
const GET_USER_SPOTS = 'spots/GET_USER_SPOTS';

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

export const fetchUserSpots = (userId) => async (dispatch) => {
    const response = await csrfFetch('/api/spots/current');
    if (response.ok) {
        const data = await response.json();
        dispatch(populateUserSpots(data));
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

const initialState = {}

const spotsReducer = (state = initialState, action) => {
    let newState = {};
    let spotDetails = '';
    let spotId = '';
    let image = '';
    let spotToUpdate = '';
    let updatedSpotImages = '';
    let userSpots = '';
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
        }  // Added missing brace here

        case ADD_IMAGE_TO_SPOT: {
            spotId = action.payload.spotId;
            image = action.payload.image;
            spotToUpdate = state[spotId];
            updatedSpotImages = spotToUpdate.SpotImages ? [...spotToUpdate.SpotImages, image] : [image];

            // Preview image if the added image is marked as a preview
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
            userSpots = action.payload.Spots.map((spot) => ({
                spot.id
            }))
        }
        default:
            return state;
    }
};

export default spotsReducer;




