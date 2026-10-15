// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error(`Bad Response. HTTP${res.status}: ${res.statusText}`);
  }
}

export async function loadData(path) {
  try {
    const response = await fetch(path);
    const data = await convertToJson(response);
    return data;
  }
  catch (error) {
    console.error(`Error loading data from path:`, error);
    throw error;
  }
}

// render a list of items using a template function
export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(template);
  // if clear is true we need to clear out the contents of the parent.
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path){
  try {
    const response = await fetch(path);
    const template = await response.text();
    return template;
  }
  catch (error) {
    console.error(`Error loading template from ${path}:`, error);
    throw error;
  }
}

function loadNavigationMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");

  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-active");
    menuToggle.classList.toggle("is-active");
    
    // Update accessibility attribute
    menuToggle.setAttribute("aria-expanded", isOpen);
  });
}

export async function loadHeaderFooter() {
  const header = await loadTemplate("../partials/header.html");
  const footer = await loadTemplate("../partials/footer.html");
  const headerElement = document.getElementById("main-header");
  const footerElement = document.getElementById("main-footer");

  renderWithTemplate(header, headerElement);
  renderWithTemplate(footer, footerElement);

  loadNavigationMenu();
}

export function processSearchParams(form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const searchParams = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
      if (value.trim() !== "") {
        searchParams.append(key, value);
        // paramsArray.push(`{${key}, ${value}}`);
      }
    }

    const queryString = searchParams.toString();
    window.location.href = `${window.location.pathname}${queryString ? "?" + queryString : ""}`;
  })
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get(param);
  return id
}

export function parseTitle(title) {
  title.trim();
  const parsed = title.split(":")[0];

  return parsed;
}

// Save and unsave utilities
function getTitleId(title) {
  if (title && typeof title === "object") {
    return title.id ?? title.imdbID ?? title.slug;
  }

  return title;
}

// export function setClick(button, callback, newClass="") {
//   button.addEventListener("click", () => {
//     callback();
//     if (newClass !== "") {
//       button.classList.toggle(newClass);
//     }
//   });
// }

export function bindSaveButton(button, title, key, onUnsave) {
  const titleId = getTitleId(title);
  const savedTitles = getLocalStorage(key) || [];
  const isSaved = savedTitles.some(
    savedTitle => String(getTitleId(savedTitle)) === String(titleId)
  );

  const updateButton = saved => {
    button.classList.toggle("saved", saved);
    button.setAttribute("aria-label", saved ? "Remove saved title" : "Save title");
  };

  updateButton(isSaved);
  button.addEventListener("click", () => {
    const saved = toggleSaveTitle(title, key);
      updateButton(saved);
      if (!saved && onUnsave) {
        onUnsave();
      }
  });
}

export async function toggleSaveTitle(title, key) {
  const titleId = getTitleId(title);
  if (titleId === undefined || titleId === null) {
    throw new Error("Cannot save a title without an id.");
  }

  // check if title already exist
  const savedTitles = await getLocalStorage(key) || [];
  const isSaved = savedTitles.some(
    savedTitle => String(getTitleId(savedTitle)) === String(titleId)
  );

  const updatedTitles = isSaved
    ? savedTitles.filter(savedTitle => String(getTitleId(savedTitle)) !== String(titleId))
    : [...savedTitles, title];

  setLocalStorage(key, updatedTitles);
  return !isSaved;
}

// export function removeSavedCard(button, parentElement) {
//   button.closest(".media-card").remove();
//   if (!parentElement.querySelector(".media-card")) {
//     parentElement.innerHTML = "<p>No titles saved yet.</p>";
//   }
// }