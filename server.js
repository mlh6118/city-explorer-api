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
  const cityName = req.query.city || 'city_name';
  const cityLat = req.query.lat || 'lat';
  const cityLon = req.query.lon || 'lon';
  console.log('Query Params: ', req.query);
  console.log('City: ', cityName, 'Latitude ', cityLat, 'Longitude ', cityLon);
  const foundCity = weatherData.find(cityObj => {
    return (cityObj.lat===cityLat) && (cityObj.lon===cityLon) && (cityName.toUpperCase().includes(cityObj.city_name.toUpperCase()));
  })
  // console.log(foundCity);

  if (foundCity === undefined){
    res.status(404).send('City not found!');
  } else {
    console.log(foundCity);
  }
  res.send(weatherData[0].data);
});

// Collect 3 variables (lat, lon, searchQuery) from front end via form submission

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
