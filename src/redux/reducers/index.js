
import { combineReducers } from 'redux';

import ForecastReducer from  './forecastReducer';
import WeatherReducer from './weatherReducer';

export default combineReducers({
    forecastData : ForecastReducer,
    weatherData : WeatherReducer
})