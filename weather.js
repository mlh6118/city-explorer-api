'use strict'

const axios = require('axios');


// WEATHER FORECAST API/Forecast Class
let weatherModule = (req, res) => {
  const cityLat = req.query.lat || '47.60621';
  const cityLon = req.query.lon || '-122.33207';
  
  const weatherAPI = async () => {
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${cityLat}&lon=${cityLon}&units=I&days=5&key=${process.env.WEATHER_API_KEY}`;
    console.log(url);
    const response = await axios.get(url);
    if (response.data === undefined) {
      res.status(500).send('City not found!');
    } else {
      const responseArray = parseWeatherData(response.data);
      res.status(200).send(responseArray);
    }
  };

  weatherAPI();

};

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
  constructor(description, date) {
    this.description = description;
    this.date = date;
  }
}

module.exports = weatherModule;
