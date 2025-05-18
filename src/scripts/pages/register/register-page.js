import { RegisterPresenter } from "../../presenters/register-presenter";

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
    this.message = document.querySelector("#register-message");
    this.btn = form.querySelector("button");
    this.form = form;

    const presenter = new RegisterPresenter(this);

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
      presenter.handleRegister({ name, email, password });
    });
  }

  showMessage(msg) {
    this.message.textContent = msg;
  }

  showSuccess(msg) {
    alert(msg);
    window.location.hash = "/login";
  }

  setLoading(isLoading) {
    this.btn.disabled = isLoading;
    this.btn.textContent = isLoading ? "Registering..." : "Register";
  }

  shakeForm() {
    this.form.classList.add("shake");
    setTimeout(() => {
      this.form.classList.remove("shake");
    }, 500);
  }
}
