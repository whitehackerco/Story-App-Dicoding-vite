import "../styles/styles.css";
import CONFIG from "./config.js";
import App from "./pages/app";

document.addEventListener("DOMContentLoaded", () => {
  const navLogin = document.getElementById("nav-login");
  const navRegister = document.getElementById("nav-register");
  const navAbout = document.getElementById("nav-about");
  const navStories = document.getElementById("nav-stories");
  const navAddStory = document.getElementById("nav-add-story");
  const logoutButton = document.getElementById("logout-button");

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (isLoggedIn) {
    navLogin.style.display = "none";
    navRegister.style.display = "none";
    navAbout.style.display = "block";
    navStories.style.display = "block";
    navAddStory.style.display = "block";
    logoutButton.style.display = "block";
  } else {
    navLogin.style.display = "block";
    navRegister.style.display = "block";
    navAbout.style.display = "none";
    navStories.style.display = "none";
    navAddStory.style.display = "none";
    logoutButton.style.display = "none";
  }

  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    location.hash = "#/login"; // Redirect to login page
    location.reload(); // Refresh to apply navigation changes
  });

  // Jalankan aplikasi utama (router)
  const app = new App({
    content: document.querySelector("#main-content"),
  });
  app.renderPage();
});
