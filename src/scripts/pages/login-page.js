import { LoginModel } from "../data/login-model";
import { LoginPresenter } from "../presenters/login-presenter";

export default class LoginPage {
  async render() {
    return `
      <section class="container">
        <form id="login-form">
          <div>
            <h1>Login</h1>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit">Login</button>
        </form>
        <p id="login-message" style="color: red;"></p>
        <p class="login-link">Don't have an account? <a href="#/register">Register here</a></p>
      </section>
    `;
  }

  async afterRender() {
    const loginForm = document.querySelector("#login-form");
    const message = document.querySelector("#login-message");

    const container = document.querySelector(".container");
    container.style.opacity = 0;
    container.style.transform = "translateY(30px)";
    setTimeout(() => {
      container.style.transition = "all 0.5s ease";
      container.style.opacity = 1;
      container.style.transform = "translateY(0)";
    }, 100);

    const model = new LoginModel();
    const presenter = new LoginPresenter(model, this);

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = loginForm.querySelector("#email").value.trim();
      const password = loginForm.querySelector("#password").value.trim();

      if (!email || !password) {
        this.showError("Email dan password harus diisi!");
        return;
      }

      await presenter.handleLogin(email, password);
    });
  }

  showLoading() {
    const loginButton = document.querySelector("#login-form button");
    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";
  }

  hideLoading() {
    const loginButton = document.querySelector("#login-form button");
    loginButton.disabled = false;
    loginButton.textContent = "Login";
  }

  showError(message) {
    const messageElement = document.querySelector("#login-message");
    messageElement.textContent = message;
  }

  showSuccess() {
    window.location.hash = "/";
    location.reload();
  }
}
