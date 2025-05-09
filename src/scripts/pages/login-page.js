import { login } from "../data/api";

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

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = loginForm.querySelector("#email").value.trim();
      const password = loginForm.querySelector("#password").value.trim();

      if (!email || !password) {
        message.textContent = "Email dan password harus diisi!";
        return;
      }

      const loginButton = loginForm.querySelector("button");
      loginButton.disabled = true;
      loginButton.textContent = "Logging in...";

      try {
        const result = await login(email, password);
        localStorage.setItem("authToken", result.loginResult.token);
        localStorage.setItem("isLoggedIn", "true");
        window.location.hash = "/";
        location.reload();
      } catch (error) {
        message.textContent =
          error.message ||
          "Login gagal! Periksa kembali email dan password Anda.";
      } finally {
        loginButton.disabled = false;
        loginButton.textContent = "Login";
      }
    });
  }
}
