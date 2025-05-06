import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import { checkToken } from "../utils/auth";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#setupDrawer();
    this.#checkUserToken();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    if (page) {
      // Tambahkan kelas untuk transisi keluar
      this.#content.classList.add("view-transition");
      this.#content.classList.remove("view-transition-active");

      // Tunggu sedikit sebelum mengganti konten
      setTimeout(async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();

        // Tambahkan kelas untuk transisi masuk
        this.#content.classList.add("view-transition-active");
      }, 100); // Waktu delay untuk transisi keluar
    } else {
      this.#content.innerHTML = `<h2>404 - Page Not Found</h2>`;
    }
  }

  #checkUserToken() {
    const token = localStorage.getItem("authToken");
    const isLoggedIn = Boolean(token);

    if (isLoggedIn) {
      // Menyembunyikan login/register, menampilkan logout dan story
      document.getElementById("nav-login").style.display = "none";
      document.getElementById("nav-register").style.display = "none";
      document.getElementById("logout-button").style.display = "inline-block";
      document.getElementById("nav-about").style.display = "inline-block";
      document.getElementById("nav-stories").style.display = "inline-block";
      document.getElementById("nav-add-story").style.display = "inline-block";
    } else {
      // Menampilkan login/register, menyembunyikan logout dan story
      document.getElementById("nav-login").style.display = "inline-block";
      document.getElementById("nav-register").style.display = "inline-block";
      document.getElementById("logout-button").style.display = "none";
      document.getElementById("nav-about").style.display = "none";
      document.getElementById("nav-stories").style.display = "none";
      document.getElementById("nav-add-story").style.display = "none";
    }
  }
}

export default App;
