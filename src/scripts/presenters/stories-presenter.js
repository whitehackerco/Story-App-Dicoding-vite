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
      this.view.renderMap(stories);
    } catch (error) {
      this.view.renderError(error.message);
    }
  }

  async postStory({ description, photo, latitude, longitude }) {
    try {
      this.view.showLoading();
      const result = await this.model.postStory({
        description,
        photo,
        latitude,
        longitude,
      });
      this.view.showSuccess(result.message || "Cerita berhasil ditambahkan!");
    } catch (error) {
      this.view.showError(error.message || "Gagal menambahkan cerita.");
    } finally {
      this.view.hideLoading();
    }
  }
}
