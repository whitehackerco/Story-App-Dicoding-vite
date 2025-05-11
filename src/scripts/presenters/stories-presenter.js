export class StoriesPagePresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async loadStories() {
    try {
      this.view.showLoading();
      const stories = await this.model.fetchStories();
      this.view.renderStories(stories);
    } catch (error) {
      this.view.renderError(error.message);
    }
  }
}
