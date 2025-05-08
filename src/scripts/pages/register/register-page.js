import { register } from "../../data/api";

export default class RegisterPage {
  async render() {
    return `
      <section class="container">
        <h1>Register</h1>
        <form id="register-form">
          <div>
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit">Register</button>
        </form>
        <p id="register-message" style="color: red;"></p>
      </section>
    `;
  }

  async afterRender() {
    const registerForm = document.querySelector("#register-form");
    const message = document.querySelector("#register-message");

    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = registerForm.querySelector("#name").value.trim();
      const email = registerForm.querySelector("#email").value.trim();
      const password = registerForm.querySelector("#password").value.trim();

      if (!name || !email || !password) {
        message.textContent = "Semua field harus diisi!";
        return;
      }

      if (password.length < 8) {
        message.textContent = "Password harus minimal 8 karakter!";
        return;
      }

      try {
        const result = await register({ name, email, password });
        alert("Registrasi berhasil! Silakan login.");
        window.location.hash = "/login";
      } catch (error) {
        message.textContent = error.message || "Registrasi gagal! Coba lagi.";
      }
    });
  }
}
