import { FETCHING_WEATHER_FAILURE, FETCHING_WEATHER_SUCCESS, FETCHING_WEATHER_REQUEST } from '../actions/types';

const initialState = {
    isFetching: true,
    erorMessage : '',
    weather: [],
};

const weatherReducer = ( state = initialState, action ) => {
    switch(action.type) {

        case FETCHING_WEATHER_REQUEST:
            return { ...state, isFetching: true, isConnected: true };
        case FETCHING_WEATHER_FAILURE:
            return { ...state, isFetching: false, errorMessage: action.payload, isConnected: true };
        case FETCHING_WEATHER_SUCCESS:
            return { ...state, isFetching: false, weather: action.payload, isConnected: true };
        default:
            return state;
        }
};

export default weatherReducer;