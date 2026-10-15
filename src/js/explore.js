import { loadHeaderFooter, qs, processSearchParams } from '/js/utils.mjs';
import GameDetails from '/js/GameDetails.mjs';
import MovieDetails from '/js/MovieDetails.mjs';
import Filters from './Filters.mjs';

// Containers
const moviesContainer = qs("#movies-container");
const gamesContainer = qs("#games-container");
const filterForm = qs("#filter-form");
// const filterButton = qs("#apply-filters");

// Objects
const movieDetails = new MovieDetails();
const gameDetails = new GameDetails();
const filters = new Filters();

// Filters
const filterParams= filters.getParams();
// console.log(filterParams);
const search = filters.getSearch();
// console.log(search);

// Load header and footer
loadHeaderFooter();

// Filter bar and mobile toggle
const toggleBtn = document.getElementById('filter-toggle');
const closeBtn = document.getElementById('filter-close');
const filterSection = document.getElementById('filter-section');

toggleBtn.addEventListener('click', () => {
  filterSection.classList.add('is-open');
});

closeBtn.addEventListener('click', () => {
  filterSection.classList.remove('is-open');
});

processSearchParams(filterForm);
const searchParams = new URLSearchParams(window.location.search);
// console.log(searchParams.toString());

const defaultExplore = async () => {
    // Movies
    const movieDefaultList = ["tt0076759", "tt0080684", "tt0086190", "tt0120915"];
    const movieList = await Promise.all(movieDefaultList.map(id => movieDetails.getMovieById(id)));
    // console.log(movieList);

    await movieDetails.renderMoviesList(movieList, moviesContainer);

    // Games
    // const testGameList = [12020, 3070, 3328];
    const gameDefaultList = ["jedi-the-fallen-order", "star-wars-jedi-survivor", "star-wars-squadrons", "star-wars-jedi-knight-ii-jedi-outcast"]
    const gameList = await Promise.all(gameDefaultList.map(title => gameDetails.getGameByTitle(title)));
    // console.log(gameList);

    await gameDetails.renderGamesList(gameList, gamesContainer);
}

const filteredExplore = async () => {
  let gameList = [];
  let movieList = [];
  if (filters.getSearch()) {
    gameList = await gameDetails.getAllContentByTitle(search);
    movieList = await movieDetails.getAllContentByTitle(search);
    // console.log(movieList);
    // console.log(gameList);

    await gameDetails.renderGamesList(gameList, gamesContainer);
    await movieDetails.renderMoviesList(movieList, moviesContainer);
  } else {
    gameList = await gameDetails.getListByFilters(filterParams.genre, filterParams.platforms);
    // console.log(gameList);
    const tempTitle = gameList[0].name;
    movieList = await movieDetails.getAllContentByTitle(tempTitle);

    await gameDetails.renderGamesList(gameList, gamesContainer);
    await movieDetails.renderMoviesList(movieList, moviesContainer);
  }
}

if(search !== null || Object.values(filterParams).some(value => value !== null)) {
  filteredExplore();
  // console.log("filtered");
} else {
  defaultExplore();
  // console.log("default");
}
