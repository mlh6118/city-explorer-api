'use strict'

const axios = require('axios');

const movies = (req, res) => {
  const cityName = req.query.city || 'Seattle';

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
