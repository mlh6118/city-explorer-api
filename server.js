'use strict';

const express = require('express');
// Not needed to be a variable because it's simply loading .config.
require('dotenv').config();
// cors gives permission to access server.
const cors = require('cors');
const weatherData = require('./data/weather.json');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

// Proof of life.
app.get('/', (request, response) => {
  response.send('You are in the root directory.');
});

// Global variables for .find()
app.get('/weatherData', (req, res) => {
  const cityName = req.query.city || 'Seattle';
  const cityLat = req.query.lat || '47.60621';
  const cityLon = req.query.lon || '-122.33207';
  console.log('Query Params: ', req.query);
  console.log('City: ', cityName, 'Latitude ', cityLat, 'Longitude ', cityLon);
  const foundCity = weatherData.find(cityObj => {
    return (Math.round(parseInt(cityObj.lat))===Math.round(parseInt(cityLat))) && (Math.round(parseInt(cityObj.lon))===Math.round(parseInt(cityLon))) && (cityName.toUpperCase().includes(cityObj.city_name.toUpperCase()));
  });
  // console.log(foundCity);

  if (foundCity === undefined){
    res.status(404).send('City not found!');
  } else {
    const responseArray = parseWeatherData(foundCity);
    // console.log(foundCity);
    console.log(responseArray);
    res.status(200).send(responseArray);
  }
  // res.send(weatherData[0].data);
});

const parseWeatherData = foundCity => {
  let responseArray = [];
  foundCity.data.forEach(day => {
    let description = `Low of ${day.low_temp}, high of ${day.high_temp} with ${day.weather.description}`;
    let date = day.valid_date;
    let response = new Forecast(description, date);
    responseArray.push(response);
  });
  return responseArray;
};

class Forecast {
  constructor(description, date){
    this.description = description;
    this.date = date;
  }
}

// Collect 3 variables (lat, lon, searchQuery) from front end via form submission

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
