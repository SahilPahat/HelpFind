import { FETCHING_FORECAST_FAILURE, FETCHING_FORECAST_SUCCESS, FETCHING_FORECAST_REQUEST } from '../actions/types';

const initialState = {
    isFetching: true,
    erorMessage : '',
    forecast: [],
};

const forecastReducer = ( state = initialState, action ) => {
    switch(action.type) {
        case FETCHING_FORECAST_REQUEST:
            return { ...state, isFetching: true, isConnected: true };
        case FETCHING_FORECAST_FAILURE:
            return { ...state, isFetching: false, errorMessage: action.payload, isConnected: true };
        case FETCHING_FORECAST_SUCCESS:
            return { ...state, isFetching: false, forecast: action.payload, isConnected: true };
        default:
            return state;
        }
};

export default forecastReducer;