'use strict';

const express = require('express');
// Not needed to be a variable because it's simply loading .config.
require('dotenv').config();
// cors gives permission to access server.
const cors = require('cors');
// const weatherData = require('./data/weather.json');
const axios = require('axios');
// import weather module
const weather = require('./weather.js');
// import movie module
const movies = require('./movies.js');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

// Proof of life.
app.get('/', (request, response) => {
  response.send('You are in the root directory.');
});

app.get('/weather', weather);

app.get('/movies', movies);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
