// scripts/pages/register/register-page.js
import { register } from "../../data/api";

export default class RegisterPage {
  async render() {
    return `
      <section class="container">
        <h1>Register Page</h1>
        <form id="register-form">
          <div>
            <label for="username">Username</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div>
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div>
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit">Register</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const registerForm = document.querySelector("#register-form");
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const username = document.querySelector("#username").value;
      const email = document.querySelector("#email").value;
      const password = document.querySelector("#password").value;

      try {
        const response = await register(username, email, password);
        if (response.token) {
          localStorage.setItem("authToken", response.token); // menyimpan token ke localStorage
          window.location.hash = "/"; // redirect ke home setelah registrasi sukses
        } else {
          alert("Registrasi gagal");
        }
      } catch (error) {
        alert("Terjadi kesalahan saat registrasi");
      }
    });
  }
}
