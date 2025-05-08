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
      this.#content.classList.add("view-transition");
      this.#content.classList.remove("view-transition-active");

      setTimeout(async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();

        this.#content.classList.add("view-transition-active");
      }, 100);
    } else {
      this.#content.innerHTML = `<h2>404 - Page Not Found</h2>`;
    }
  }

  #checkUserToken() {
    const token = localStorage.getItem("authToken");
    const isLoggedIn = Boolean(token);

    if (isLoggedIn) {
      document.getElementById("nav-login").style.display = "none";
      document.getElementById("nav-register").style.display = "none";
      document.getElementById("logout-button").style.display = "inline-block";
      document.getElementById("nav-about").style.display = "inline-block";
      document.getElementById("nav-stories").style.display = "inline-block";
      document.getElementById("nav-add-story").style.display = "inline-block";
    } else {
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
