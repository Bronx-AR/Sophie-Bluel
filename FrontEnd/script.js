// Elements
const elements = {
  gallery: document.querySelector(".gallery"),
  filtersContainer: document.querySelector(".filters-container"),
  editBanner: document.querySelector(".modify-banner"),
  editBtn: document.querySelectorAll(".edit-btn"),
  modalContainer: document.querySelector(".modal-container"),
  modalTriggers: document.querySelectorAll(".modal-trigger"),
  modalGallery: document.querySelector(".modal-gallery-work"),
  header: document.querySelector("header"),
  portfolio: document.getElementById("portfolio"),
  log: document.querySelector(".log-link-title"),
  modal1: document.querySelector(".pictures-gallery"),
  modal2: document.querySelector(".add-picture-gallery"),
  addPictureBtn: document.querySelector(".addPicture-btn"),
  returnArrow: document.querySelector(".return-arrow"),
  addPicture: document.querySelector(".addPictures"),
  addImageModal: document.querySelector(".btn-addImage"),
  validateBtn: document.querySelector(".validate-btn"),
  addTitle: document.getElementById("add-title"),
  addCategorie: document.getElementById("add-categories"),
  previewImg: document.querySelector(".preview-img"),
  imgContainer: document.querySelector(".img-container"),
  errorAdd: document.querySelector(".error-add"),
  deleteMsg: document.querySelector(".delete-msg"),
  filters: new Set(),
};

// State
const state = {
  tokenValue: localStorage.token,
  imageForm: "",
  categoryForm: "",
  titleForm: undefined,
  works: [],
  categories: [],
};

// API Fetch Function
const fetchFromAPI = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok.');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
    return null;
  }
};

// Fetch Works
const fetchGet = async () => {
  state.works = await fetchFromAPI(`http://${window.location.hostname}:5678/api/works`);
  if (state.works) {
    console.log(state.works[2]);
    galleryWork(state.works);
    workGallery(state.works);
  }
};

// Fetch Categories
const fetchCategory = async () => {
  state.categories = await fetchFromAPI(`http://${window.location.hostname}:5678/api/categories`);
  if (state.categories) {
    filtres(state.categories);
  }
};

// Fetch Delete
const fetchDelete = async (id) => {
  try {
    await fetch(`http://${window.location.hostname}:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.tokenValue}`,
      },
      mode: "cors",
    });
    console.log("Work deleted:", id);
    // Remove element from DOM here...
  } catch (error) {
    console.error("Error deleting work:", error);
  }
};

// Gallery Work
function galleryWork(works) {
  works.forEach((work) => {
    const post = document.createElement("figure");
    post.setAttribute("id", `${work.id}.`);
    post.innerHTML = `
      <img src=${work.imageUrl} alt="image de ${work.title}">
      <figcaption>${work.title}</figcaption> 
    `;
    elements.gallery.appendChild(post);
  });
}

// Work Gallery
function workGallery(works) {
  works.forEach((work) => {
    const workPost = document.createElement("figure");
    workPost.setAttribute("id", `${work.id}`);
    workPost.innerHTML = `
      <div class="workgallery-container">
        <i id="${work.id}" class="fa-solid fa-trash-can trash-icon"></i>
        <img class="modal-image" src=${work.imageUrl} alt="image de ${work.title}">
      </div> 
    `;
    elements.modalGallery.appendChild(workPost);
    deleteImage(workPost);
  });
}

// Filtrage des catégories
function filtres(categories) {
  categories.forEach((filter) => {
    elements.filters.add(filter.name);
  });

  const filtersArray = Array.from(elements.filters);
  filtersArray.forEach((filter) => {
    const filtre = document.createElement("button");
    filtre.classList.add("filter-btn", `${filter.split(" ").join("")}`);
    filtre.innerText = filter;
    elements.filtersContainer.appendChild(filtre);
  });

  const btnTous = document.getElementById("tous");
  btnTous.addEventListener("click", () => {
    elements.gallery.innerHTML = "";
    fetchGet();
  });

  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      buttons.forEach((button) => button.classList.remove("active"));
      elements.gallery.innerHTML = "";
      const workFiltered = state.works.filter((work) => {
        return work.category.name === e.target.innerText;
      });
      button.classList.add("active");
      galleryWork(workFiltered);
    });
  });
}

// Edit Mode
function editMode() {
  if (localStorage.login === "true") {
    elements.filtersContainer.style.setProperty("visibility", "hidden");
    elements.header.style.setProperty("margin-top", "100px");
    elements.portfolio.style.setProperty("margin-top", "150px");
    elements.editBanner.style.setProperty("display", "flex");
    elements.log.innerText = "logout";
    elements.editBtn.forEach((btn) => {
      btn.style.setProperty("display", "flex");
    });
    console.log("Vous êtes connecté ! Enjoy !");
  } else {
    console.log("Vous n'êtes pas connecté ! Identifiez-vous !");
  }
}

// Logout
elements.log.addEventListener("click", () => {
  localStorage.removeItem("login");
  localStorage.removeItem("token");
  elements.log.innerText = "login";
});

// Toggle Modal
function toggleModal() {
  elements.modalContainer.classList.toggle("target");
}
elements.modalTriggers.forEach((trigger) =>
  trigger.addEventListener("click", toggleModal)
);

// ... (other functions and event listeners)

// Initialize
fetchGet();
fetchCategory();
editMode();
// ... (call other functions)
