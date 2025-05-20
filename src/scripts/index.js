import "../styles/styles.css";
import CONFIG from "./config.js";
import App from "./pages/app";
import { subscribePush, unsubscribePush } from "./utils/push-subscription";

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

  const pushBtn = document.getElementById("subscribe-push");
  const bellIcon = pushBtn.querySelector("i");

  async function updatePushUI() {
    if (!("serviceWorker" in navigator)) return;
    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg) return;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      bellIcon.classList.remove("fa-bell");
      bellIcon.classList.add("fa-bell-slash");
      pushBtn.setAttribute("aria-label", "Notification Off");
      pushBtn.title = "Matikan Notifikasi";
      pushBtn.dataset.subscribed = "true";
    } else {
      bellIcon.classList.remove("fa-bell-slash");
      bellIcon.classList.add("fa-bell");
      pushBtn.setAttribute("aria-label", "Notification On");
      pushBtn.title = "Aktifkan Notifikasi";
      pushBtn.dataset.subscribed = "false";
    }
  }

  pushBtn.addEventListener("click", async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    const token = localStorage.getItem("authToken");
    const vapidKey =
      "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";
    if (pushBtn.dataset.subscribed === "true") {
      try {
        await unsubscribePush(reg, token);
        await updatePushUI();
        alert("Notifikasi dimatikan!");
      } catch (e) {
        alert("Gagal unsubscribe notifikasi.");
      }
    } else {
      try {
        await subscribePush(reg, vapidKey, token);
        await updatePushUI();
        alert("Notifikasi diaktifkan!");
      } catch (e) {
        alert("Gagal subscribe notifikasi.");
      }
    }
  });

  updatePushUI();
});
