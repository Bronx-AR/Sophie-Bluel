/***********************************************************************************************************************/

// ------ DÉCLARATION DES VARIABLES LIÉES À L'AFFICHAGE DES WORKS ET USER-LOGIN----------//

/***********************************************************************************************************************/

let workData = []; // array pour stocker la data des works
let categoryData = []; // array pour stocker les data des categories
let workToDisplay = []; // array pour stocker les works à afficher à l'issu de la fonction showfilterwork()
let selectedCategory = 0; // variable pour initialiser l'id de la catagorie du Work
let userLoggedIn = localStorage.getItem("token"); // Varible pour stocker l'existence du token dans la session storage

const sectionGallery = document.querySelector(".gallery");
const buttonFiltre = document.querySelectorAll(".btn-filtre");
const sectionFiltres = document.querySelector(".filtres");
const modeEditionHeader = document.getElementById("modeEditionHeader");
const buttonChangePicture = document.getElementById("buttonChangePicture");
const buttonModifyProject = document.getElementById("buttonModifyProject");
const buttonLogIn = document.getElementById("buttonLogIn");
const buttonLogOut = document.getElementById("buttonLogOut");

/***********************************************************************************************************************/

// ------ DÉCLARATION DES VARIABLES LIÉES AUX MODALS----------//

/***********************************************************************************************************************/

let formAddProject = document.getElementById("formAddProject");
let workId = "";

const modal = document.getElementById("modal");
const modalWorkUpload = document.getElementById("modalWorkUpload");
const sectionGallery2 = document.querySelector(".gallery2");
const buttonCloseModal = document.getElementById("closeModal");
const buttonSendPicture = document.getElementById("sendPicture");
const buttonCloseModalWorkUpload = document.getElementById(
  "closeModalWorkUpload"
);
const buttonBackToModal = document.getElementById("backToModal");
const buttonDelete = document.getElementsByClassName("fa-solid fa-trash-can");
const stopPropagationClass = document.querySelector(".stopPropagation");
const imageInput = document.getElementById("image");
const imagePreview = document.getElementById("imagePreview");

/***********************************************************************************************************************/

// ------ DÉCLARATION DES FONCTIONS LIÉES À L'AFFICHAGE DES WORKS ET USER-LOGIN ----------//

/***********************************************************************************************************************/

// Fonction pour récuperer les tout les works.
const getWorks = async () => {
  await fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((data) => (workData = data));
};

// Fonction pour récuperer les catégories des works
const getCategory = async () => {
  await fetch("http://localhost:5678/api/categories")
    .then((res) => res.json())
    .then((data) => (categoryData = data));
};

// fonction pour créer dynamiquement les filtres des catégories
const createFilter = async () => {
  await getCategory();
  sectionFiltres.innerHTML =
    `<button class="btn-filtre" id="0">Tous</button>` +
    categoryData
      .map(
        (category) =>
          `
    <button class="btn-filtre" id="${category.id}">${category.name}</button>
    `
      )
      .join("");
};

// fonciton pour faire afficher les works de manière dynamique sur le DOM
const showWorks = async () => {
  await getWorks();
  sectionGallery.innerHTML = workData
    .map(
      (work) => ` 
    <figure>
    <img src= ${work.imageUrl} alt="${work.title}">
    <figcaption>${work.title}</figcaption>
    </figure>
  `
    )
    .join("");
};

// fonction pour créer les eventlistner sur les filtres générés sur le Dom
const createFilterEventlistner = async () => {
  await createFilter();
  const buttonFiltre = document.querySelectorAll(".btn-filtre");
  buttonFiltre.forEach((button) => {
    button.addEventListener("click", function () {
      showFilterWorks(parseInt(button.getAttribute("id")));
    });
  });
};

// fonction qui gère l'affichage des works sur le dom en fonction du filtre clické
const showFilterWorks = async (selectedCategory) => {
  await createFilterEventlistner();
  if (selectedCategory === 0) {
    workToDisplay = workData;
  } else {
    workToDisplay = workData.filter(function (workData) {
      return workData.categoryId === selectedCategory;
    });
  }
  sectionGallery.innerHTML = workToDisplay
    .map(
      (workToDisplay) => ` 
    <figure>
    <img src= ${workToDisplay.imageUrl} alt="${workToDisplay.title}">
    <figcaption>${workToDisplay.title}</figcaption>
    </figure>
  `
    )
    .join("");
};

// fonction pour determiner ce qu'on affiche ou ce qu'on retire de la page d'acceuil quand le token n'existe pas dans le LocalStorage donc utilisateur non connecté
const visitorPageConfiguration = () => {
  modeEditionHeader.style.display = "none";
  buttonLogOut.remove();
  buttonChangePicture.remove();
  buttonModifyProject.remove();
};

// fonction pour determiner ce qu'on affiche ou ce qu'on retire de la page d'acceuil quand le token existe dans le sessionStorage donc utilisateur est administrateur
const administratorPageConfiguration = () => {
  sectionFiltres.remove();
  buttonLogIn.remove();
};

// fonction pour gerer le changement de configuration en fonction de si l'utilisateur des connecté ou pas.
const changeConfiguration = () => {
  if (userLoggedIn) {
    administratorPageConfiguration();
  } else {
    visitorPageConfiguration();
  }
};

// fonction pour permettre a l'administrateur de logout. On clear le session storage ou est stocké le token. Puis on force un reload de la page en question. La page se reloadera en configuration visiteur puisque le token n'existe plus dans la session storage.
const endAdminSession = () => {
  buttonLogOut.addEventListener("click", function () {
    localStorage.removeItem("token");
    window.location.reload();
  });
};

/***********************************************************************************************************************/

// ------ DÉCLARATION DES FONCTIONS LIÉES AUX MODALS ----------//

/***********************************************************************************************************************/

// Fonction qui gère l'affichage des works de la base de donné dans la modale. Elle fait appel à la fonction getwork qui gère la recupération des works de la base de donné puis elle inject en innerHtml le contenu dans la modale.
const showWorksInModal = async () => {
  await getWorks();
  sectionGallery2.innerHTML = workData
    .map(
      (work) => ` 
    <figure>
    <div class ="imgModal">
    <img src= ${work.imageUrl} alt="${work.title}">
    <i id="deleteWork${work.id}" class="fa-solid fa-trash-can "></i>
    </div>
    </figure>
  `
    )
    .join("");
};

// fonction qui permet d'arreter la propagation d'un evenlistner. Notamment pour permettre de fermer le modal en cliquant à l'extérieur de celui ci.
const stopPropagation = (e) => {
  e.stopPropagation();
};

// fonction qui gère l'ouverture et la fermeture de la modale avec les eventlistener qui permettent de naviguer dans le modal.
const modalOpenAndClose = () => {
  buttonModifyProject.addEventListener("click", function () {
    modal.style.display = "flex";
  });
  buttonSendPicture.addEventListener("click", function () {
    modalWorkUpload.style.display = "flex";
  });
  buttonCloseModalWorkUpload.addEventListener("click", function () {
    modalWorkUpload.style.display = "none";
    modal.style.display = "none";
  });
  buttonBackToModal.addEventListener("click", function () {
    modalWorkUpload.style.display = "none";
  });
  buttonCloseModal.addEventListener("click", function () {
    modal.style.display = "none";
  });
  modal.addEventListener("click", function () {
    modal.style.display = "none";
  });
  stopPropagationClass.addEventListener("click", stopPropagation);
};

// fonction qui fait un appel DELETE à l'API pour supprimer des works. Elle tient compte de la categorie ID pour savoir quel Work supprimer.
const allowWorkDelete = async () => {
  await showWorksInModal();
  for (item of buttonDelete) {
    workId = item.getAttribute("id").slice(10, 120);
    item.addEventListener("click", function () {
      fetch(`http://localhost:5678/api/works/${workId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    });
  }
};

// fonction qui fait un appel POST à l'API pour ajouter des works. Utilisation ici d'un Objet FormData pour recuperer l'ensemble des donnés saisi dans le form par l'utilisateur.
const allowPostProject = () => {
  formAddProject.addEventListener("submit", function (e) {
    e.preventDefault();
    const projectImage = document.getElementById("image").files[0];
    const projectCategory = document.getElementById("category").value;
    const projectTitle = document.getElementById("title").value;
    const workuploadFormData = new FormData();
    workuploadFormData.append("title", projectTitle);
    workuploadFormData.append("image", projectImage);
    workuploadFormData.append("category", projectCategory);

    let postParam = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: workuploadFormData,
    };
    fetch("http://localhost:5678/api/works", postParam);
  });
};

// fonction qui permet d'afficher un preview de l'image selectionné en input avant de faire le submit
const getUploadPreview = () => {
  imageInput.addEventListener("change", function () {
    const projectImage = document.getElementById("image").files[0];
    imagePreview.src = URL.createObjectURL(projectImage);
  });
};

const createInputCategories = async () => {
  await getCategory();
  const projectCategory = document.getElementById("category");
  console.log(projectCategory);
  projectCategory.innerHTML =
    `<option value="">    </option>` +
    categoryData
      .map(
        (category) =>
          `
        <option value="${category.id}">${category.name}</option>
    `
      )
      .join("");
};
/***********************************************/

// ------ Exécution des fonctions affichage des works  ----------//

/***********************************************/

showWorks(); // un premier appel de la fonction showWorks pour afficher tout les travaux a l'ecran lors du chargement
createFilterEventlistner(); // creation des eventListner sur les filtres pour afficher dynamiquement les travaux demandé
changeConfiguration(); // chargement des config de disposition de la page
endAdminSession(); // possibilité de se deconnecter

/***********************************************/

// ------ Exécution des fonctions affichage des works  ----------//

/***********************************************/

modalOpenAndClose(); // permettre d'ouvre et fermer le modal
allowWorkDelete(); // permettre de supprimer des works
createInputCategories(); // generer dynamiquement les categories des inputs categories
allowPostProject(); // permettre de publier des works
getUploadPreview(); // permettre d'avoir une preview de ce qu'on upload comme image
