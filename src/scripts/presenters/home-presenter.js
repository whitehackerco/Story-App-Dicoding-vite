export class HomePagePresenter {
  constructor(view) {
    this.view = view;
  }

  setupCTA() {
    const token = localStorage.getItem("authToken");
    const ctaLink = token ? "#/stories" : "#/login";
    this.view.renderCTA(ctaLink);
  }
}
