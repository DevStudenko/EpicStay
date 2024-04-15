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
    switch (action.type) {
        case LOAD_REVIEWS: {
            const { reviews, spotId } = action.payload; // Ensure variables are scoped to this block
            const existingReviews = state[spotId] || [];
            const newReviews = reviews.filter(newReview =>
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

