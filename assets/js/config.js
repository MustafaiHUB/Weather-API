'use strict';

export const WEATHER_API_KEY = '56fcffabbbaf4fe1890230404232903';
export const GEOCODE_API_KEY = '744423069680588838418x8822';
export const TIME_OUT = 5;

export const callTimeOut = async function (TIME_OUT) {
    return new Promise(function (_, reject) {
        setTimeout(() => {
            reject(new Error('Can not get weather data!'))
        }, TIME_OUT * 1000);
    })
}