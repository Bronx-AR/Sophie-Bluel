const messageError = document.querySelector(".message-error");
const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      const data = await response.json();
      sessionStorage.setItem("accessToken", data.token);
      window.location.href = "./index.html";
    } else {
      messageError.innerText = "Erreur dans l’identifiant ou le mot de passe";
    }
  } catch (error) {
    console.log(error);
    messageError.innerText = "Suite à un problème technique, veuillez réessayer ultérieurement";
  }
});
