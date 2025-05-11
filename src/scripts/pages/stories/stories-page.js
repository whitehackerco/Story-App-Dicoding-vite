import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { StoriesModel } from "../../data/stories-model";
import { StoriesPagePresenter } from "../../presenters/stories-presenter";

export default class StoriesPage {
  async render() {
    return `
      <section class="container">
        <div id="stories-list">Loading...</div>
      </section>
    `;
  }

  async afterRender() {
    const model = new StoriesModel();
    const presenter = new StoriesPagePresenter(model, this);
    await presenter.loadStories();
  }

  renderStories(stories) {
    const storiesHtml = stories
      .map(
        (story) => `
          <div class="story-card">
            <img src="${story.photo}" alt="${story.name}" class="story-image" />
            <div class="story-content">
              <h3 class="story-username">${story.name}</h3>
              <p class="story-description">${story.description}</p>
              <p class="story-date">${new Date(
                story.createdAt
              ).toLocaleDateString()}</p>
              <p class="story-location">${story.location}</p>
            </div>
          </div>
        `
      )
      .join("");

    const storiesList = document.getElementById("stories-list");
    storiesList.innerHTML = storiesHtml;
  }

  renderError(message) {
    const storiesList = document.getElementById("stories-list");
    storiesList.innerHTML = `<p>${message}</p>`;
  }

  showLoading() {
    const storiesList = document.getElementById("stories-list");
    storiesList.innerHTML = "<p>Loading...</p>";
  }
}
