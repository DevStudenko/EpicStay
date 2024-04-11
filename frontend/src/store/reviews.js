// Action Types
const LOAD_REVIEWS = 'reviews/setReviews';

// Action Creator
export const loadReviews = (reviews, spotId) => ({
    type: LOAD_REVIEWS,
    reviews,
    spotId

});

// Thunk Action Creator
export const fetchReviewsBySpotId = (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}/reviews`);
    if (response.ok) {
        const data = await response.json();
        dispatch(loadReviews(data.Reviews, spotId));
    }
};

// reviews reducer
export default function reviewsReducer(state = {}, action) {
    let reviews;
    switch (action.type) {
        case LOAD_REVIEWS:
            reviews = {
                ...state,
                [action.spotId]: action.reviews
            }
            return reviews
        default:
            return state
    }
}

