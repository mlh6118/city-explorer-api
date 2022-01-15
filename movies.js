'use strict';

const axios = require('axios');
const cache = require('./cache.js');

const movies = (req, res) => {
  const cityName = req.query.city || 'Seattle';
  //Data becomes stale after 24 hours
  const dataStale = 24*60*60*1000;

  const movieAPI = async () => {
    const key = `movies-${cityName}`;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${cityName}`;

    if(cache[key] && (Date.now() - cache[key].timestamp < dataStale)){
      console.log('Cache hit: Movie data');
      //console.log(cache[key].data);
      res.status(200).send(cache[key].data);
    } else {
      console.log('Cache Miss: movie data');
      cache[key] = {};
      cache[key].timestamp = Date.now();

      const response = await axios.get(url);
      if (response.data === undefined) {
        res.status(500).send('City not found!');
      } else {
        const responseArray = parseMovieData(response.data);
        res.status(200).send(responseArray);
        cache[key].data = responseArray;
      }
    }
  };

  movieAPI();

};

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

module.exports = movies;
