import { csrfFetch } from './csrf';

const GET_ALL_SPOTS = 'spots/getAllSpots';
const GET_SPOT_DETAILS = 'spots/getSpotDetails';
const ADD_NEW_SPOT = 'spots/addNewSpot';
const ADD_IMAGE_TO_SPOT = 'spots/addImageToSpot';

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

const addNewSpot = (spot) => ({
    type: ADD_NEW_SPOT,
    payload: spot
});

const addImageToSpotAction = (spotId, image) => ({
    type: ADD_IMAGE_TO_SPOT,
    payload: { spotId, image },
});

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
        dispatch(getSpotDetails(data));
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
        throw new Error('Failed to create spot');
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
        default:
            return state;
    }
};

export default spotsReducer;




