import { renderWithTemplate, renderListWithTemplate } from '/js/utils.mjs';

const moviesURL = import.meta.env.VITE_OMDB_SERVER_URL;

function movieTemplate(movie) {
  return `
    <div class="movie-card">
      <img src="${movie.Poster}" alt="${movie.Title} Poster" class="movie-poster" />
      <h2 class="details-title-sml">${movie.Title}</h2>
      <p class="details-sml"><span class="label">Released:</span> ${movie.Year}</p>
      <p class="details-sml">${movie.Genre}</p>
      <p class="details-sml">${movie.Runtime} | ${movie.Rated}</p>
      <p class="details-sml"><span class="label">Director:</span> ${movie.Director}</p>
      <p class="details-sml float-right"><span class="label">IMDB</span> ${movie.imdbRating}/10</p>
      <a href="details/${movie.imdbID}" class="details-sml link-primary">View Details →</a>
    </div>
  `;
}

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class MovieDetails {
  constructor() {
    // this.category = category;
    // this.path = this.category === "games" ? gamesURL : moviesURL;
  }

  async getAllMoviesByTitle(title) {
    const response = await fetch(`${moviesURL}s=${title}`);
    const data = await convertToJson(response);

    return data;
  }

  async getMovieByTitle(title) {
    const response = await fetch(`${moviesURL}t=${title}`);
    const data = await convertToJson(response);

    return data.Result;
  }

  async getMovieById(id) {
    const response = await fetch(`${moviesURL}i=${id}`);
    const movie = await convertToJson(response);
    return movie;
  }

  async renderMovie(movie, parentElement) {
    const template = movieTemplate(movie);
    await renderWithTemplate(template, parentElement);
  }

  async renderMoviesList(moviesList, parentElement) {
    await renderListWithTemplate(movieTemplate, parentElement, moviesList);
  }
}
