import { FETCHING_FORECAST_FAILURE, FETCHING_FORECAST_SUCCESS, FETCHING_FORECAST_REQUEST } from './types';
import APP_ID  from './../../env';

export const fetchingForecastRequest = () => ({ 
    type : FETCHING_FORECAST_REQUEST 
});

export const fetchingForecastSuccess = (json) => ({ 
    type : FETCHING_FORECAST_SUCCESS,
    payload: json
});

export const fetchingForecastFailure = (error) => ({ 
    type : FETCHING_FORECAST_FAILURE,
    payload: error 
});


export const fetchForecast = (data) => {

    var city = '';
    var latitude = '';
    var longitude = '';

    if(typeof data === 'string'){
        city = data
    } else {
        latitude = data.locationData.coords.latitude;
        longitude = data.locationData.coords.longitude;
    }

    return async (dispatch) => {
        dispatch(fetchingForecastRequest());
        try {
            let response = '';
            if(city === ''){
                response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&APPID=${APP_ID}`)
            } else {
                response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=${APP_ID}`);
            }

            let json = await response.json();

            dispatch(fetchingForecastSuccess(json));
        } catch(error) {

            dispatch(fetchingForecastFailure(error));
        }
    }
}
