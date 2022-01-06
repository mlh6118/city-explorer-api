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

app.get('/weatherData', (req, res) => {
  const type = req.query.type || 'city_name';
  console.log('Query Params: ', req.query);
  console.log('Type: ', type);
  res.status(200).send(weatherData[type]);
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
