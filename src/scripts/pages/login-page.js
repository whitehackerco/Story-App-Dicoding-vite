import { login } from "@/scripts/data/api";

export default class LoginPage {
  async render() {
    return `
      <section class="container">
        <h1>Login</h1>
        <form id="login-form">
          <div>
            <label for="email">Email:</label><br />
            <input type="email" id="email" name="email" required />
          </div>
          <div>
            <label for="password">Password</label>
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

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = loginForm.querySelector("#email").value.trim();
      const password = loginForm.querySelector("#password").value.trim();

      if (!email || !password) {
        message.textContent = "Email dan password harus diisi!";
        return;
      }

      try {
        const result = await login(email, password);
        console.log(result);
        localStorage.setItem("authToken", result.loginResult.token);
        window.location.hash = "/";
      } catch (error) {
        message.textContent =
          error.message ||
          "Login gagal! Periksa kembali email dan password Anda.";
      }
    });
  }
}
