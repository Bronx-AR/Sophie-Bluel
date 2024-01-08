// Const
const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const mdpInput = document.getElementById("mdp");
const errorMsg = document.querySelector(".erreur-msg");
// Let
let mail = "";
let mdp = "";

// Fetch POST pour Login
function fetchPost(userLogins) {
  fetch("http://" + window.location.hostname + ":5678/api/users/login", {
    method: "POST",
    headers: { accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(userLogins),
    mode: "cors",
  })
    .then((response) => response.json())
    .then((res) => {
      localStorage.token = res.token;
      if (
        res.message === "user not found" ||
        localStorage.token === "undefined"
      ) {
        errorMsg.innerText = "Erreur dans l’identifiant ou le mot de passe";
        console.log(
          "Connexion Impossible : Erreur Identifiant ou Mot de passe"
        );
      } else {
        localStorage.login = true;
        window.location.href = "index.html";
        console.log("Connexion réussie");
      }
    })
    .catch((err) => console.log("Il y a eu une erreur sur le Fetch: " + err));
}
// Récupère la valeur dans l'input
emailInput.addEventListener("input", (e) => {
  userLogins.email = e.target.value;
  console.log(e.target.value);
});
// Récupère la valeur dans l'input
mdpInput.addEventListener("input", (e) => {
  userLogins.password = e.target.value;
  console.log(e.target.value);
});

let userLogins = {
  //   email: mail,
  //   password: mdp,
};
// Apppel fetch lors du submit
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(userLogins);
  fetchPost(userLogins);
});
