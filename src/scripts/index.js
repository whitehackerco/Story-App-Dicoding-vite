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
    window.location.hash = "/login";
    location.reload();
  });

  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.getElementById("drawer-button"),
    navigationDrawer: document.getElementById("navigation-drawer"),
  });

  await app.renderPage();

  function setupSkipToContent() {
    const skipBtn = document.getElementById("skip-to-content");
    if (!skipBtn) return;

    skipBtn.onclick = (event) => {
      event.preventDefault();
      skipBtn.blur();

      const hash = window.location.hash;

      setTimeout(() => {
        if (hash === "#/" || hash === "" || hash === "#") {
          const cta = document.querySelector(".btn-cta");
          if (cta) {
            cta.setAttribute("tabindex", "-1");
            cta.focus();
            cta.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        } else if (hash === "#/about") {
          const aboutSection = document.getElementById("interactive-map-story");
          if (aboutSection) {
            aboutSection.setAttribute("tabindex", "-1");
            aboutSection.focus();
            aboutSection.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        } else if (hash === "#/login") {
          const emailInput = document.getElementById("email");
          if (emailInput) {
            emailInput.setAttribute("tabindex", "-1");
            emailInput.focus();
            emailInput.scrollIntoView({ behavior: "smooth", block: "center" });
          }

          const nameInput = document.getElementById("name");
          if (nameInput) {
            nameInput.setAttribute("tabindex", "-1");
            nameInput.focus();
            nameInput.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        } else if (hash === "#/stories") {
          const storiesList = document.getElementById("stories-list");
          if (storiesList) {
            storiesList.setAttribute("tabindex", "-1");
            storiesList.focus();
            storiesList.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        } else if (hash === "#/add-story") {
          const descInput = document.getElementById("story-description");
          if (descInput) {
            descInput.setAttribute("tabindex", "-1");
            descInput.focus();
            descInput.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        } else {
          const mainContent = document.getElementById("main-content");
          if (mainContent) {
            mainContent.setAttribute("tabindex", "-1");
            mainContent.focus();
            mainContent.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }, 0);
    };
  }

  setupSkipToContent();

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
    updateNavigation();
    setupSkipToContent();
  });
});
