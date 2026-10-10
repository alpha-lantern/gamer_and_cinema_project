import { loadHeaderFooter, qs, getLocalStorage, setLocalStorage } from '/js/utils.mjs';
import GameDetails from '/js/GameDetails.mjs';
import MovieDetails from '/js/MovieDetails.mjs';

const moviesContainer = qs("#movies-container");
const gamesContainer = qs("#games-container");

const movieDetails = new MovieDetails();
const gameDetails = new GameDetails();

// Load header and footer
loadHeaderFooter();

const explore = async () => {
    // Movies
    const testList = ["tt1285016", "tt4154796", "tt4154756"];
    const movieList = await Promise.all(testList.map(id => movieDetails.getMovieById(id)));
    console.log(movieList);

    await movieDetails.renderMoviesList(movieList, moviesContainer);

    // Games
    const testGameList = [12020, 3070, 3328];
    const gameList = await Promise.all(testGameList.map(id => gameDetails.getGameById(id)));
    console.log(gameList);

    await gameDetails.renderGamesList(gameList, gamesContainer);
}

explore();