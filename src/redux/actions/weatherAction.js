import { FETCHING_WEATHER_FAILURE, FETCHING_WEATHER_SUCCESS, FETCHING_WEATHER_REQUEST } from './types';
import APP_ID  from './../../env';

export const fetchingWeatherRequest = () => ({ 
    type : FETCHING_WEATHER_REQUEST 
});

export const fetchingWeatherSuccess = (json) => ({ 
    type : FETCHING_WEATHER_SUCCESS,
    payload: json
});

export const fetchingWeatherFailure = (error) => ({ 
    type : FETCHING_WEATHER_FAILURE,
    payload: error 
});


export const fetchWeather = (data) => {

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
        dispatch(fetchingWeatherRequest());
        try {
            let response = '';
            if(city === ''){
                response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=${APP_ID}`)
            } else {
                response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${APP_ID}`);
            }

            let json = await response.json();

            dispatch(fetchingWeatherSuccess(json));
        } catch(error) {

            dispatch(fetchingWeatherFailure(error));
        }
    }
}
