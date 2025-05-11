export class LoginPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async handleLogin(email, password) {
    try {
      this.view.showLoading();
      const result = await this.model.login(email, password);
      localStorage.setItem("authToken", result.loginResult.token);
      localStorage.setItem("isLoggedIn", "true");
      this.view.showSuccess();
    } catch (error) {
      this.view.showError(error.message);
    } finally {
      this.view.hideLoading();
    }
  }
}
