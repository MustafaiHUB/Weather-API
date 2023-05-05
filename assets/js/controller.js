import * as model from './model';
import view from './view';

import 'core-js/stable'; // polyfilling
import 'regenerator-runtime/runtime'; // polyfilling


const getWeatherData = async function (query, unit = 'C') {
    try {
        const data = await model.weatherAPI(query);
        view.renderData(data, unit);
    } catch (err) {
        console.log(err.message);
    }
}

const controlHandleSearchInput = async function (query) {
    try {
        if (!query) return;
        await getWeatherData(query);
    } catch (err) {
        console.log(err.message);
    }
}

const controlHandleLocation = async function (lat, long) {
    try {
        const location = await model.geoCode(lat, long);
        // console.log(location);
        await getWeatherData(location);
    } catch (err) {
        console.log(err.message);
    }
}

const init = () => {
    console.log('Welcome to the weather API website');
    view; // call the constructor
    view._addHandlerSearchInput(controlHandleSearchInput);
    view._addHandlerLocation(controlHandleLocation);
}
init();