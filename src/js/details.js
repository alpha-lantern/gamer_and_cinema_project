import { loadHeaderFooter, qs, getParam } from '/js/utils.mjs';
import GameDetails from '/js/GameDetails.mjs';
import MovieDetails from '/js/MovieDetails.mjs';

const contentContainer = qs("#main-content");

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

async function init() {
    await loadHeaderFooter();

    const type = getMediaType();
    console.log(type);

    if (type[0] !== null) {
        const gameDetails = new GameDetails();
        const game = await gameDetails.getGameById(type[0]);

        console.log(game);

        gameDetails.renderGame(game, contentContainer);
    }
    else if (type[1] !== null) {
        const movieDetails = new MovieDetails();
        const movie = await movieDetails.getMovieById(type[1]);

        console.log(movie);

        movieDetails.renderMovie(movie, contentContainer);
    }

}

init();