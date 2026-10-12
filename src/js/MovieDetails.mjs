import { renderWithTemplate, renderListWithTemplate } from '/js/utils.mjs';

const moviesURL = import.meta.env.VITE_OMDB_SERVER_URL;
const apiKey = import.meta.env.VITE_OMDB_API_KEY;

function movieCardTemplate(movie) {
  return `
    <div class="media-card">
      <div class="media-cover">
        <img src="${movie.Poster}" alt="${movie.Title} Poster" class="movie-poster" loading="lazy" />
      </div>

      <span class="media-type">Movies & Series</span>
      <span class="media-rating"><strong class="label">IMDB:</strong> ${movie.imdbRating}/10</span>

      <div class="media-data">
        <h3 class="details-title-sml">${movie.Title}</h3>
        <p class="details-sml"><span class="label">Released:</span> ${movie.Year}</p>
        <p class="details-sml">${movie.Genre}</p>
      </div>

      <p class="details-sml media-rated">${movie.Runtime} | ${movie.Rated}</p>
      <p class="details-sml media-dev-dir"><span class="label">Director:</span> ${movie.Director}</p>

      <a href="../details/?movie=${movie.imdbID}" class="go-to-details link-primary">View Details → </a>
    </div>
  `;
}

function movieTemplate(movie) {
  return `
    <div class="movie-details">
      <div class="main-cover">
        <img src="${movie.Poster}" alt="${movie.Title} Poster" class="main-poster" loading="lazy" />
      </div>
      <p class="type-rating">
        <span class="type">Movies & Series</span>
        <span class="rating"><strong class="label">IMDB:</strong> ${movie.imdbRating}/10</span>
      </p>

      <h2 class="details-title">${movie.Title}</h3>

      <div class="details-card">
        <p class="details-sml"><span class="label">Released:</span> ${movie.Year}</p>
        <p class="details-sml">Genres: ${movie.Genre}</p>
        <p class="details-sml media-rated">${movie.Runtime} | ${movie.Rated}</p>
        <p class="details-sml media-dev-dir"><span class="label">Director:</span> ${movie.Director}</p>
      </div>
      
      <div class="description">
        <h3>Plot</h3>
        <p>${movie.Plot}</p>
      </div>

      <div class="ratings">
        <h3>Ratings</h3>
        <p>${movie.Ratings.map(r => `${r.Source}: ${r.Value}`).join(" | ")}</p>
      <div>
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
    const response = await fetch(`${moviesURL}?s=${title}&apikey=${apiKey}`);
    const data = await convertToJson(response);

    return data;
  }

  async getMovieByTitle(title) {
    const response = await fetch(`${moviesURL}?t=${title}&apikey=${apiKey}`);
    const data = await convertToJson(response);

    return data.Result;
  }

  async getMovieById(id) {
    const response = await fetch(`${moviesURL}?i=${id}&apikey=${apiKey}`);
    const movie = await convertToJson(response);
    return movie;
  }

  async renderMovie(movie, parentElement) {
    const template = movieTemplate(movie);
    await renderWithTemplate(template, parentElement);
  }

  async renderMoviesList(moviesList, parentElement) {
    await renderListWithTemplate(movieCardTemplate, parentElement, moviesList,"beforeend");
  }
}
