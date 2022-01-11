'use strict';

const express = require('express');
// Not needed to be a variable because it's simply loading .config.
require('dotenv').config();
// cors gives permission to access server.
const cors = require('cors');
// const weatherData = require('./data/weather.json');
const axios = require('axios');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

// Proof of life.
app.get('/', (request, response) => {
  response.send('You are in the root directory.');
});

// WEATHER FORECAST API/Forecast Class
app.get('/weatherData', (req, res) => {
  const cityLat = req.query.lat || '47.60621';
  const cityLon = req.query.lon || '-122.33207';

  const weatherAPI = async () => {
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${cityLat}&lon=${cityLon}&key=${process.env.WEATHER_API_KEY}`;

    const response = await axios.get(url);
    if (response.data === undefined) {
      res.status(500).send('City not found!');
    } else {
      const responseArray = parseWeatherData(response.data);
      res.status(200).send(responseArray);
    }
  };

  weatherAPI();

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
  constructor(description, date) {
    this.description = description;
    this.date = date;
  }
}

app.get('/movies', (req, res) => {
  const cityName = req.query || 'Seattle';

  const movieAPI = async () => {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${cityName}`;

    const response = await axios.get(url);
    console.log(response.data);
    if (response.data === undefined || response.data.results.length === 0) {
      console.log('No movies related to this place were found.');
      res.status(500).send('No movies related to this place were found.');
    } else {
      const responseArray = parseMovieData(response.data);
      res.status(200).send(responseArray);
    }
    console.log(response.data.page);
  };

  movieAPI();

});

const parseMovieData = foundMovies => {
  let movieArray = [];
  foundMovies.results.forEach(movie => {
    let original_title = movie.original_title;
    let overview = movie.overview;
    let responseMovie = new Movie(original_title, overview);
    movieArray.push(responseMovie);
  });
  return movieArray;
};

class Movie {
  constructor(original_title, overview) {
    this.original_title = original_title;
    this.overview = overview;
  }
}

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
