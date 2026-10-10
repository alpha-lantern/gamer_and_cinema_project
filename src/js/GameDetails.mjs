import { renderWithTemplate, renderListWithTemplate } from '/js/utils.mjs';

const gamesURL = import.meta.env.VITE_RAWG_SERVER_URL;
const apiKey = import.meta.env.VITE_RAWG_API_KEY;

function gameTemplate(game) {
  return `
    <div class="movie-card">
      <img src="${game.background_image}" alt="${game.name} Poster" class="game-poster" width="300" />
      <h2 class="details-title-sml">${game.name}</h2>
      <p class="details-sml"><span class="label">Released:</span> ${game.released}</p>
      <p class="details-sml">${game.genres?.map(g => g.name).join(", ")}</p>
      <p class="details-sml">${game.playtime} | ${game.rating}</p>
      <p class="details-sml"><span class="label">Director:</span> ${game.developers?.[0]?.name}</p>
      <p class="details-sml float-right"><span class="label">RAWG:</span> ${game.rating}/5</p>
      <a href="details/${game.id}" class="details-sml link-primary">View Details →</a>
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

export default class GameDetails {
  constructor() {
    
  }

  async getAllGamesByTitle(title) {
    const response = await fetch(`${gamesURL}?search=${title}&key=${apiKey}`);
    const data = await convertToJson(response);

    return data.results;
  }

  async getGameByTitle(title) {
    const response = await fetch(`${gamesURL}?name=${title}&key=${apiKey}`);
    const data = await convertToJson(response);

    return data.results;
  }

  async getGameById(id) {
    const response = await fetch(`${gamesURL}/${id}?key=${apiKey}`);
    const game = await convertToJson(response);
    return game;
  }

  async renderGame(game, parentElement) {
    const template = gameTemplate(game);
    await renderWithTemplate(template, parentElement);
  }

  async renderGamesList(gamesList, parentElement) {
    await renderListWithTemplate(gameTemplate, parentElement, gamesList);
  }
}