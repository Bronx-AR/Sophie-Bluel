// Const
const gallery = document.querySelector('.gallery');
const filtersContainer = document.querySelector('.filters-container');
const editBanner = document.querySelector('.modify-banner');
const editBtn = document.querySelectorAll('.edit-btn');
const modalContainer = document.querySelector('.modal-container');
const modalTriggers = document.querySelectorAll('.modal-trigger');
const modalGallery = document.querySelector('.modal-gallery-work');
const header = document.querySelector('header');
const portfolio = document.getElementById('portfolio');
const log = document.querySelector('.log-link-title');
const modal1 = document.querySelector('.pictures-gallery');
const modal2 = document.querySelector('.add-picture-gallery');
const addPictureBtn = document.querySelector('.addPicture-btn');
const returnArrow = document.querySelector('.return-arrow');
const addPicture = document.querySelector('.addPictures');
const addImageModal = document.querySelector('.btn-addImage');
const validateBtn = document.querySelector('.validate-btn');
const addTitle = document.getElementById('add-title');
const addCategorie = document.getElementById('add-categories');
const previewImg = document.querySelector('.preview-img');
const imgContainer = document.querySelector('.img-container');
const errorAdd = document.querySelector('.error-add');
const deleteMsg = document.querySelector('.delete-msg');
const filters = new Set();
// Let
let tokenValue = localStorage.token;
let imageForm = '';
let categoryForm = '';
let titleForm;

// Utilisez des constantes pour les URLs de l'API
const apiUrls = {
  works: 'http://localhost:5678/api/works',
  categories: 'http://localhost:5678/api/categories',
};

const fetchData = async (url, options) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

//Fetch Works
const getWorks = async (categorieId = null) => {
  try {
    const works = await fetchData(apiUrls.works);
    createWorks(works, categorieId);
    createWorksModale(works);
  } catch (error) {
    console.error(`Error getting works: ${error.message}`);
  }
};

//Fetch Catégories
const getCategories = async () => {
  try {
    const categories = await fetchData(apiUrls.categories);
    createCategories(categories);
  } catch (error) {
    console.error(`Error getting categories: ${error.message}`);
  }
};

//Fetch suppression travaux
const fetchDelete = async (id) => {
  try {
    await fetch(`${apiUrls.works}/${id}`, {
      method: 'DELETE',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenValue}`,
      },
      mode: 'cors',
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.confirmation === 'OK') {
          id.remove();
        }
        console.log(res);
      });
  } catch (error) {
    console.log(`Error on fetch: ${error}`);
  }
};

//Implémente les Images dans la gallery
function createWorks(works, categorieId) {
  works.map((work) => {
    if (categorieId == work.category.id || categorieId == null) {
      const post = document.createElement('figure');
      post.setAttribute('id', `${work.id}.`);
      post.innerHTML = `
      <img src=${work.imageUrl} alt="image de ${work.title}">
      <figcaption>${work.title}</figcaption> 
      `;
      gallery.appendChild(post);
    }
  });
}

// Créer les filtres
function createCategories(categories) {
  categories.map((filter) => {
    filters.add(filter.name);
  });
  //Transforme l'objet set en array
  const filtersArray = Array.from(filters);

  for (let i = 0; i < categories.length; i++) {
    const filtre = document.createElement('button');
    filtre.classList.add('filter-btn');
    filtre.innerText = categories[i].name;
    filtre.setAttribute('categorieId', categories[i].id);
    filtersContainer.appendChild(filtre);
  }
  // Filtre au clic
  //Filtre pour le bouton Tous
  const btnTous = document.getElementById('tous');
  btnTous.addEventListener('click', () => {
    gallery.innerHTML = '';
    getWorks();
  });
  //Filtre pour les catégories suivantes
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach((button) => {
    button.addEventListener('click', (e) => {
      buttons.forEach((button) => button.classList.remove('active'));
      gallery.innerHTML = '';
      button.classList.add('active');

      let categorieId = button.getAttribute('categorieId');
      getWorks(categorieId);
    });
  });
}

// Ajout de la gallery dans la modale
function createWorksModale(works) {
  works.map((work) => {
    const workPost = document.createElement('figure');
    workPost.setAttribute('id', `${work.id}`);
    workPost.innerHTML = `
    <div class="workgallery-container">
      <i id="${work.id}"  class="fa-solid fa-trash-can trash-icon" ></i>
      <img class="modal-image" src=${work.imageUrl} alt="image de ${work.title}">
    </div> 
    `;
    modalGallery.appendChild(workPost);

    deleteImage(workPost);
  });
}

// Affiche le mode edition si connecté
function editMode() {
  if (localStorage.login === 'true') {
    filtersContainer.style.setProperty('visibility', 'hidden');
    header.style.setProperty('margin-top', '100px');
    portfolio.style.setProperty('margin-top', '150px');
    editBanner.style.setProperty('display', 'flex');
    log.innerText = 'logout';
    editBtn.forEach((btn) => {
      btn.style.setProperty('display', 'flex');
    });
    console.log('Vous êtes connecté ! Enjoy !');
  } else {
    console.log('Vous n\'êtes pas connecté ! Identifiez-vous !');
  }
}

// Au clic sur "logout", supprime dans le local storage login: true et token
function clearLocalStorageAndToggleLogin() {
  localStorage.removeItem('login');
  localStorage.removeItem('token');
  log.innerText = 'login';
}

// Affiche la modale
function toggleModal() {
  modalContainer.classList.toggle('target');
}

function showAddPictureModal() {
  modal1.style.display = 'none';
  modal2.style.display = 'flex';
}

function handleAddPictureBtnClick(e) {
  e.preventDefault();
  showAddPictureModal();
}

function returnModal1() {
  modal1.style.display = 'block';
  modal2.style.display = 'none';
  previewImg.src = '';
  previewImg.style.setProperty('display', 'none');
  imgContainer.style.setProperty('display', 'flex');
}

// Au click sur la fleche retour de la modale, on revient à la modale précédente
function handleReturnArrowClick() {
  returnModal1();
}

// Ajouter des écouteurs d'événements
log.addEventListener('click', clearLocalStorageAndToggleLogin);
modalTriggers.forEach((trigger) => trigger.addEventListener('click', toggleModal));
addPictureBtn.addEventListener('click', handleAddPictureBtnClick);
returnArrow.addEventListener('click', handleReturnArrowClick);

// Function suppression des travaux
function deleteImage(imgValue) {
  const deleteIcon = document.querySelectorAll('.trash-icon');
  deleteIcon.forEach((delIcon) => {
    delIcon.addEventListener('click', (e) => {
      e.preventDefault();
      const idRemove = document.getElementById(e.target.id);
      const portfolioRemove = document.getElementById(`${e.target.id}.`);
      fetchDelete(parseInt(e.target.id));
      console.log(e.target.id);
      idRemove.remove();
      portfolioRemove.remove();
      deleteMsg.innerText = 'Supprimé !';
      setTimeout(() => {
        deleteMsg.innerText = '';
      }, 3000);
    });
  });
}

// Function ajout des images
function addImage() {
  // Image
  addImageModal.addEventListener('input', (e) => {
    imageForm = e.target.files[0];
    const img = URL.createObjectURL(imageForm);
    previewImg.src = img;
    previewImg.style.setProperty('display', 'block');
    imgContainer.style.setProperty('display', 'none');
  });
  // Titre
  addTitle.addEventListener('input', (e) => {
    titleForm = e.target.value;
  });
  // Catégories
  addCategorie.addEventListener('input', (e) => {
    categoryForm = e.target.selectedIndex;
  });
  // Submit
  addPicture.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (imageForm && titleForm && categoryForm) {
      const formData = new FormData();
      formData.append('image', imageForm);
      formData.append('title', titleForm);
      formData.append('category', categoryForm);

      try {
        const response = await fetch(apiUrls.works, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${tokenValue}`,
          },
          body: formData,
        });

        const res = await response.json();
        console.log(res);

        errorAdd.innerText = 'Posté !';
        errorAdd.style.color = 'green';

        gallery.innerHTML = '';
        modalGallery.innerHTML = '';
        await getWorks();
        addPicture.reset();
        previewImg.src = '';
        previewImg.style.setProperty('display', 'none');
        imgContainer.style.setProperty('display', 'flex');

        setTimeout(() => {
          errorAdd.innerText = '';
        }, 4000);
      } catch (error) {
        console.log(`Error posting work: ${error.message}`);
      }
    } else {
      errorAdd.innerText = 'Veuillez remplir tous les champs.';
      errorAdd.style.color = 'red';
      setTimeout(() => {
        errorAdd.innerText = '';
      }, 4000);
      console.log('Tous les champs ne sont pas remplis !');
    }
  });
}

function checkConditions() {
  // Conditions ici si nécessaire
  /* if (addImageModal.files[0]?.size < 4000000 && addTitle.value !== '' && addCategorie.value !== '') {
    validateBtn.classList.add('envoyer');
  } else {
    validateBtn.classList.remove('envoyer');
  } */
}

function main() {
  // Appel des différentes fonctions
  getWorks();
  getCategories();
  editMode();
  returnModal1();
  checkConditions();
  deleteImage();
  addImage();
}

main();
