import { renderWithTemplate, renderListWithTemplate } from '/js/utils.mjs';

const gamesURL = import.meta.env.VITE_RAWG_SERVER_URL;
const apiKey = import.meta.env.VITE_RAWG_API_KEY;

function gameCardTemplate(game) {
  return `
    <div class="media-card">
      <div class="media-cover">
        <img src="${game.background_image}" alt="${game.name} Poster" class="game-poster" width="300" loading="lazy" />
      </div>

      <span class="media-type">Video game</span>
      <span class="media-rating"><strong class="label">RAWG:</strong> ${game.rating}/5</span>

      <div class="media-data">
        <h3 class="details-title-sml">${game.name}</h3>
        <p class="details-sml media-released"><span class="label">Released:</span> ${game.released}</p>
        <p class="details-sml media-genres">${game.genres?.map(g => g.name).join(", ")}</p>
      </div>

      <p class="details-sml media-rated">${game.esrb_rating?.name} | ${game.platforms?.map(p => p.platform.name).slice(0, 3).join(", ")}</p>

      <p class="details-sml media-dev-dir"><span class="label">Developer:</span> ${game.developers?.[0]?.name}</p>

      <a href="../details/?game=${game.id}" class="go-to-details link-primary">View Details → </a>
    </div>
  `;
}

function gameTemplate(game) {
  return `
    <div class="game-details">
      <div class="main-cover">
        <img src="${game.background_image}" alt="${game.name} Poster" class="main-poster" loading="lazy" />
      </div>

      <p class="type-rating">
        <span class="type">Video game</span>
        <span class="rating"><strong class="label">RAWG:</strong> ${game.rating}/5</span>
      </p>

      <h2 class="details-title">${game.name}</h2>

      <div class="details-card">
        <p class="released"><span class="label">Released:</span> ${game.released}</p>
        <p class="genres">Genres: ${game.genres?.map(g => g.name).join(", ")}</p>
        <p class="rated">ESRB: ${game.esrb_rating?.name}</p>
        <p class="platforms">Platforms: ${game.platforms?.map(p => p.platform.name).join(", ")}</p>
        <p class="dev-dir"><span class="label">Developer:</span> ${game.developers?.[0]?.name}</p>
      </div>

      <div class="description">
        <h3>Description</h3>
        ${game.description}
      </div>

      <div class="stores">
        <h3>Where to buy?</h3>
        <p>${game.stores.map(s => s.store.name).join(" | ")}</p>
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

export default class GameDetails {
  constructor() {
    
  }

  async getAllGamesByTitle(title) {
    const response = await fetch(`${gamesURL}?search=${title}&key=${apiKey}`);
    const data = await convertToJson(response);

    return data.results;
  }

  async getGameByTitle(title) {
    const response = await fetch(`${gamesURL}/${title}?key=${apiKey}`);
    const data = await convertToJson(response);

    return data;
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
    await renderListWithTemplate(gameCardTemplate, parentElement, gamesList, "beforeend");
  }
}