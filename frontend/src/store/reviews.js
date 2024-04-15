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
    let existingReviews = '';
    let newReviews = '';
    switch (action.type) {
        case LOAD_REVIEWS:
            existingReviews = state[action.spotId] || [];
            newReviews = action.reviews.filter(newReview =>
                !existingReviews.some(existingReview => existingReview.id === newReview.id)
            );
            return {
                ...state,
                [spotId]: [...existingReviews, ...newReviews]
            };
        }
        default:
            return state;
    }
}

