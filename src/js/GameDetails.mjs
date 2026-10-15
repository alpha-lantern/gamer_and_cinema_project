import { renderWithTemplate, renderListWithTemplate, setClick, toggleSaveTitle, loadData, parseTitle } from "/js/utils.mjs";

const gamesURL = import.meta.env.VITE_RAWG_SERVER_URL;
const apiKey = import.meta.env.VITE_RAWG_API_KEY;

function gameCardTemplate(game) {
  return `
    <div class="media-card">
      <div class="media-cover">
        <img src="${game.background_image}" alt="${game.name} Poster" class="game-poster" width="300" loading="lazy" />
        <button class="save-btn" aria-label="Save title" data-id="${game.id}">
          <svg class="star-icon" viewBox="0 0 24 24" width="24" height="24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      </div>

      <span class="media-type">Video game</span>
      <span class="media-rating"><strong class="label">RAWG:</strong> ${game.rating}/5</span>

      <div class="media-data">
        <h3 class="details-title-sml">${game.name}</h3>
        <p class="details-sml media-released"><span class="label">Released:</span> ${game.released}</p>
        <p class="details-sml media-genres">${game.genres?.map(g => g.name).join(", ") || "Not Listed"}</p>
      </div>

      <p class="details-sml media-rated">${game.esrb_rating?.name || "Not Rated"} | ${game.platforms?.map(p => p.platform.name).slice(0, 3).join(", ")}</p>

      <p class="details-sml media-dev-dir"><span class="label">Developer:</span> ${game.developers?.[0]?.name || "Not Listed"}</p>

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
        <span class="rating"><strong class="label">RAWG:</strong> ${game.rating || "- "}/5</span>
      </p>

      <h2 class="details-title">${game.name}</h2>

      <div class="details-card">
        <p class="released"><span class="label">Released:</span> ${game.released}</p>
        <p class="genres">Genres: ${game.genres?.map(g => g.name).join(", ")}</p>
        <p class="rated">ESRB: ${game.esrb_rating?.name || "Not Rated"}</p>
        <p class="platforms">Platforms: ${game.platforms?.map(p => p.platform.name).join(", ")}</p>
        <p class="dev-dir"><span class="label">Developer:</span> ${game.developers?.[0]?.name || "Not Listed"}</p>
      </div>

      <div class="description">
        <h3>Description</h3>
        ${game.description}
      </div>

      <div class="stores">
        <h3>Where to buy?</h3>
        <p>${game.stores.map(s => s.store.name).join(" | ") || "Not Listed"}</p>
      <div>
    </div>
  `;
}

export default class GameDetails {
  constructor() {
    
  }

  async getAllContentByTitle(title) {
    const titleSearch = parseTitle(title);
    const data = await loadData(`${gamesURL}?search=${titleSearch}&key=${apiKey}`);

    return data.results;
  }

  async getGameByTitle(title) {
    const data = await loadData(`${gamesURL}/${title}?key=${apiKey}`);

    return data;
  }

  async getGameById(id) {
    const data = await loadData(`${gamesURL}/${id}?key=${apiKey}`);
    return data;
  }

  async renderGame(game, parentElement) {
    const template = gameTemplate(game);
    await renderWithTemplate(template, parentElement);
  }

  async renderGamesList(gamesList, parentElement) {
    await renderListWithTemplate(gameCardTemplate, parentElement, gamesList, "beforeend");
    
    const saveBtns = document.querySelectorAll(".save-btn");
    // console.log(saveBtns);
    const localKey = "savedGames";

    for(const btn of saveBtns) {
      // console.log(btn.dataset.id);

      const title = await this.getGameById(btn.dataset.id);
      // console.log(title);

      setClick(btn, () => {
        toggleSaveTitle(title, localKey)
      }, "saved");
    }
  }

  async getListByFilters(genre="", platform="") {
    let url = `${gamesURL}?key=${apiKey}`;
    if(genre !== "") {
      url += `&genres=${genre}`;
    }
    if(platform !== "") {
      url += `&platform=${platform}`;
    }

    const data = await loadData(url);

    return data.results;
  }
}