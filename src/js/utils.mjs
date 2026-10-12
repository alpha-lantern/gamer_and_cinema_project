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
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
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

    const formData = new FormData(form)
    const searchParams = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
      if (value.trim() !== "") {
        searchParams.append(key, value);
        paramsArray.push(`{${key}, ${value}}`);
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

// export function getSearchParams(button, form) {
//   setClick(button, processSearchParams(form));
// }