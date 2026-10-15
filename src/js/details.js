import { loadHeaderFooter, qs, getParam } from '/js/utils.mjs';
import GameDetails from '/js/GameDetails.mjs';
import MovieDetails from '/js/MovieDetails.mjs';

const contentContainer = qs("#main-content");
const relatedContainer = qs("#related-content");
const gameDetails = new GameDetails();
const movieDetails = new MovieDetails();

const getMediaType = () => {
    try {
        const gameId = getParam("game") || null;
        const movieId = getParam("movie") || null;
        return [gameId, movieId];
    } catch (error) {
        console.error("Something went wrong retrieving the parameter", error);
        throw error;
    }
}

const renderRelatedContent = async(titleString) => {
    const relatedGames = await gameDetails.getAllContentByTitle(titleString) || null;
    const relatedMovies = await movieDetails.getAllContentByTitle(titleString) || null;

    // console.log(relatedGames);
    // console.log(relatedMovies);

    if (relatedGames !== null) {
        gameDetails.renderGamesList(relatedGames.slice(0, 4), relatedContainer);
    }

    if (relatedMovies !== null) {
        movieDetails.renderMoviesList(relatedMovies.slice(0, 4), relatedContainer);
    }
}

async function init() {
    await loadHeaderFooter();

    const type = getMediaType();
    console.log(type);

    if (type[0] !== null) {
        const game = await gameDetails.getGameById(type[0]);

        // console.log(game);

        gameDetails.renderGame(game, contentContainer);
        await renderRelatedContent(game.name)
    }
    else if (type[1] !== null) {
        const movie = await movieDetails.getMovieById(type[1]);

        // console.log(movie);

        movieDetails.renderMovie(movie, contentContainer);
        await renderRelatedContent(movie.Title)
    }
}

init();