// Elements
const elements = {
  loginForm: document.getElementById("login-form"),
  emailInput: document.getElementById("email"),
  mdpInput: document.getElementById("mdp"),
  errorMsg: document.querySelector(".erreur-msg"),
};

// State
let userLogins = {
  email: "",
  password: "",
};

// Fonction Fetch POST pour le Login
function fetchPost(userLogins) {
  fetch(`http://localhost:5678/api/users/login`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userLogins),
    mode: "cors",
  })
    .then((response) => response.json())
    .then((res) => {
      handleLoginResponse(res);
    })
    .catch((err) => {
      console.error("Erreur de Fetch: ", err);
      elements.errorMsg.innerText = "Erreur lors de la connexion";
    });
}

// Fonction de gestion de la réponse du login
function handleLoginResponse(res) {
  if (res.message === "user not found" || localStorage.token === "undefined") {
    elements.errorMsg.innerText = "Erreur dans l’identifiant ou le mot de passe";
    console.log("Connexion Impossible : Erreur Identifiant ou Mot de passe");
  } else {
    localStorage.token = res.token;
    localStorage.login = true;
    window.location.href = "index.html";
    console.log("Connexion réussie");
  }
}

// Écouteur pour la saisie de l'email
elements.emailInput.addEventListener("input", (e) => {
  userLogins.email = e.target.value;
  console.log(e.target.value);
});

// Écouteur pour la saisie du mot de passe
elements.mdpInput.addEventListener("input", (e) => {
  userLogins.password = e.target.value;
  console.log(e.target.value);
});

// Appel fetch lors de la soumission du formulaire
elements.loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(userLogins);
  fetchPost(userLogins);
});
