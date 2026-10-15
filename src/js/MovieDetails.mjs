import { renderWithTemplate, renderListWithTemplate, bindSaveButton, loadData, parseTitle } from "/js/utils.mjs";

const moviesURL = import.meta.env.VITE_OMDB_SERVER_URL;
const apiKey = import.meta.env.VITE_OMDB_API_KEY;

function movieCardTemplate(movie) {
  return `
    <div class="media-card">
      <div class="media-cover">
        <img src="${movie.Poster}" alt="${movie.Title} Poster" class="movie-poster" loading="lazy" />
        <button class="movie-save-btn save-btn" aria-label="Save title" data-id="${movie.imdbID}">
          <svg class="star-icon" viewBox="0 0 24 24" width="24" height="24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      </div>

      <span class="media-type">Movies & Series</span>
      <span class="media-rating"><strong class="label">IMDB:</strong> ${movie.imdbRating || "- "}/10</span>

      <div class="media-data">
        <h3 class="details-title-sml">${movie.Title}</h3>
        <p class="details-sml"><span class="label">Released:</span> ${movie.Year}</p>
        <p class="details-sml">${movie.Genre || "Not Listed"}</p>
      </div>

      <p class="details-sml media-rated">${movie.Runtime || "Not Listed"} | ${movie.Rated || "Not Rated"}</p>
      <p class="details-sml media-dev-dir"><span class="label">Director:</span> ${movie.Director || "Not Listed"}</p>

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
        <span class="rating"><strong class="label">IMDB:</strong> ${movie.imdbRating || "Not Rated"}/10</span>
      </p>

      <h2 class="details-title">${movie.Title}</h3>

      <div class="details-card">
        <p class="details-sml"><span class="label">Released:</span> ${movie.Year}</p>
        <p class="details-sml">Genres: ${movie.Genre || "Not Listed"}</p>
        <p class="details-sml media-rated">${movie.Runtime} | ${movie.Rated || "Not Rated"}</p>
        <p class="details-sml media-dev-dir"><span class="label">Director:</span> ${movie.Director || "Not Listed"}</p>
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

export default class MovieDetails {
  constructor() {
    // this.category = category;
    // this.path = this.category === "games" ? gamesURL : moviesURL;
  }

  async getAllContentByTitle(title) {
    const titleSearch = parseTitle(title);
    const data = await loadData(`${moviesURL}?s=${titleSearch}&apikey=${apiKey}`);

    return data.Search;
  }

  async getMovieByTitle(title) {
    const data = await loadData(`${moviesURL}?t=${title}&apikey=${apiKey}`);

    return data.Search;
  }

  async getMovieById(id) {
    const data = await loadData(`${moviesURL}?i=${id}&apikey=${apiKey}`);
    return data;
  }

  async renderMovie(movie, parentElement) {
    const template = movieTemplate(movie);
    await renderWithTemplate(template, parentElement);
  }

  async renderMoviesList(moviesList, parentElement) {
    await renderListWithTemplate(movieCardTemplate, parentElement, moviesList,"beforeend");
    const localKey = "savedMovies";

    const saveBtns = document.querySelectorAll(".movie-save-btn");
    // console.log(saveBtns);

    for(const [index, btn] of saveBtns.entries()) {
      // console.log(btn.dataset.id);

      const title = moviesList[index];
      // console.log(title);

      bindSaveButton(btn, title, localKey);
    }
  }
}
