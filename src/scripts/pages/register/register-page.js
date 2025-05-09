import { register } from "../../data/api";

export default class RegisterPage {
  async render() {
    return `
     <section class="container register-page">
        <h1 class="form-title">Create an Account</h1>
        <form id="register-form" class="form-box">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" placeholder="Your name..." required />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="you@example.com" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="At least 8 characters" required />
          </div>
          <button type="submit" class="btn-submit">Register</button>
        </form>
        <p id="register-message" class="form-message"></p>
      </section>
    `;
  }

  async afterRender() {
    const form = document.querySelector("#register-form");
    const message = document.querySelector("#register-message");

    const container = document.querySelector(".register-page");
    container.style.opacity = 0;
    container.style.transform = "translateY(20px)";
    setTimeout(() => {
      container.style.transition = "all 0.4s ease";
      container.style.opacity = 1;
      container.style.transform = "translateY(0)";
    }, 100);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = form.querySelector("#name").value.trim();
      const email = form.querySelector("#email").value.trim();
      const password = form.querySelector("#password").value.trim();

      if (!name || !email || !password) {
        message.textContent = "Semua field harus diisi!";
        shakeForm(form);
        return;
      }

      if (password.length < 8) {
        message.textContent = "Password harus minimal 8 karakter!";
        shakeForm(form);
        return;
      }

      const btn = form.querySelector("button");
      btn.disabled = true;
      btn.textContent = "Registering...";

      try {
        await register({ name, email, password });
        alert("Registrasi berhasil! Silakan login.");
        window.location.hash = "/login";
      } catch (error) {
        message.textContent = error.message || "Registrasi gagal! Coba lagi.";
        shakeForm(form);
      } finally {
        btn.disabled = false;
        btn.textContent = "Register";
      }
    });

    function shakeForm(element) {
      element.classList.add("shake");
      setTimeout(() => {
        element.classList.remove("shake");
      }, 500);
    }
  }
}
