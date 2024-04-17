// Action Types
import { csrfFetch } from './csrf'

const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS'
export const ADD_REVIEW = 'reviews/ADD_REVIEW'

// Action Creators
export const loadReviews = (reviews, spotId) => ({
    type: LOAD_REVIEWS,
    reviews,
    spotId
})

export const addReview = (review, user) => ({
    type: ADD_REVIEW,
    payload: { ...review, user }
})

// Thunk Action Creators
export const fetchReviewsBySpotId = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)
    if (response.ok) {
        const data = await response.json()
        dispatch(loadReviews(data.Reviews, spotId))
    }
}

export const createReview = ({ spotId, review, stars, user }) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            review,
            stars
        })
    })
    if (response.ok) {
        const review = await response.json()
        dispatch(addReview(review, user))
    }
}

// reviews reducer
export default function reviewsReducer(state = {}, action) {
    switch (action.type) {
        case LOAD_REVIEWS: {
            let existingReviews = state[action.spotId] || []
            let newReviews = action.reviews.filter(newReview =>
                !existingReviews.some(existingReview => existingReview.id === newReview.id)
            )
            return {
                ...state,
                [action.spotId]: [...existingReviews, ...newReviews]
            }
        }

        case ADD_REVIEW: {
            let newState = { ...state }
            newState[action.payload.spotId] = newState[action.payload.spotId] || []
            newState[action.payload.spotId].push(action.payload)
            return newState
        }
        default:
            return state
    }
}


