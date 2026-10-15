import { loadHeaderFooter, qs, getLocalStorage } from "/js/utils.mjs";
import GameDetails from "./GameDetails.mjs";
import MovieDetails from "./MovieDetails.mjs";

const savedTitlesSection = qs("#saved-titles")
const localGames = "savedGames";
const localMovies = "savedMovies";

async function init() {
    await loadHeaderFooter();

    const gameDetails = new GameDetails();
    const movieDetails = new MovieDetails();

    const savedGames = getLocalStorage(localGames);
    const savedMovies = getLocalStorage(localMovies);

    if (savedGames !== null && savedGames.length > 0) {
        gameDetails.renderGamesList(savedGames, savedTitlesSection);
    }

    if (savedMovies !== null && savedMovies.length > 0) {
        movieDetails.renderMoviesList(savedMovies, savedTitlesSection);
    }
}

init();