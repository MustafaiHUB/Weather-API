import { TIME_OUT } from "./config";
import { WEATHER_API_KEY } from "./config";
import { GEOCODE_API_KEY } from "./config";
import { callTimeOut } from "./config";

export const weatherAPI = async function (query) {
    try {
        console.log(query);
        // The first Promise call will be handled
        const res = await Promise.race([fetch(`https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${query}&days=7&aqi=yes&alerts=no`), callTimeOut(TIME_OUT)]);

        if (!res.ok) console.log('Something went wrong');
        const data = await res.json();

        return data;
    } catch (err) {
        throw err;
    }
}

export const geoCode = async function (lat, long) {
    try {
        const res = await Promise.race([fetch(`https://geocode.xyz/${lat},${long}?geoit=json&auth=${GEOCODE_API_KEY}`), callTimeOut(TIME_OUT)]);

        if (!res.ok) console.log('Something went wrong');
        const data = await res.json();
        const { region: city } = data;

        return city;
    } catch (err) {
        throw err
    }
}