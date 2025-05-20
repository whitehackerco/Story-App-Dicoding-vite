import { StoriesModel } from "../data/stories-model";

export class StoryDetailPresenter {
  constructor(view) {
    this.view = view;
    this.model = new StoriesModel();
  }

  async loadDetail(id) {
    try {
      this.view.showLoading();
      const story = await this.model.fetchStoryDetail(id);
      this.view.renderDetail(story);
    } catch (error) {
      this.view.showError(error.message);
    }
  }
}
