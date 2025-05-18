import { LoginModel } from "../data/login-model";

export class RegisterPresenter {
  constructor(view) {
    this.view = view;
    this.model = new LoginModel();
  }

  async handleRegister({ name, email, password }) {
    if (!name || !email || !password) {
      this.view.showMessage("Semua field harus diisi!");
      this.view.shakeForm();
      return;
    }
    if (password.length < 8) {
      this.view.showMessage("Password harus minimal 8 karakter!");
      this.view.shakeForm();
      return;
    }

    this.view.setLoading(true);
    try {
      await this.model.register({ name, email, password });
      this.view.showSuccess("Registrasi berhasil! Silakan login.");
    } catch (error) {
      this.view.showMessage(error.message || "Registrasi gagal! Coba lagi.");
      this.view.shakeForm();
    } finally {
      this.view.setLoading(false);
    }
  }
}
