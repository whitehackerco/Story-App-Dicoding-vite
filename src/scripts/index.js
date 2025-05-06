import "../styles/styles.css";
import CONFIG from "./config.js";
import App from "./pages/app";

document.addEventListener("DOMContentLoaded", async () => {
  const navLogin = document.getElementById("nav-login");
  const navRegister = document.getElementById("nav-register");
  const navAbout = document.getElementById("nav-about");
  const navStories = document.getElementById("nav-stories");
  const navAddStory = document.getElementById("nav-add-story");
  const logoutButton = document.getElementById("logout-button");

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const updateNavigation = () => {
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
  };

  updateNavigation();

  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("authToken");
    window.location.hash = "/login"; // Redirect ke halaman login
    location.reload(); // Refresh halaman
  });

  // Jalankan aplikasi utama (router)
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.getElementById("drawer-button"),
    navigationDrawer: document.getElementById("navigation-drawer"),
  });

  await app.renderPage();

  // Tangani perubahan hash untuk navigasi
  window.addEventListener("hashchange", async () => {
    await app.renderPage();
    updateNavigation(); // Perbarui navigasi setiap kali hash berubah
  });
});
