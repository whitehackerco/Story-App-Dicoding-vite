import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { StoriesModel } from "../../data/stories-model";
import { StoriesPagePresenter } from "../../presenters/stories-presenter";

export default class StoriesPage {
  async render() {
    return `
      <section class="container">
        <div id="map" class="map-container"></div>
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
              ).toLocaleString()}</p>
              <p class="story-location">${story.location}</p>
              <a href="#/stories/${story.id}" class="btn-cta">Detail Story</a>
            </div>
          </div>
        `
      )
      .join("");
    document.getElementById("stories-list").innerHTML = storiesHtml;
  }

  renderError(message) {
    const storiesList = document.getElementById("stories-list");
    storiesList.innerHTML = `<p>${message}</p>`;
  }

  showLoading() {
    const storiesList = document.getElementById("stories-list");
    storiesList.innerHTML = "<p>Loading...</p>";
  }

  renderMap(stories) {
    const map = L.map("map").setView([-6.2, 106.816666], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    stories.forEach((story) => {
      if (story.latitude && story.longitude) {
        const marker = L.marker([story.latitude, story.longitude]).addTo(map);
        marker.bindPopup(`
          <div>
            <h3>${story.name}</h3>
            <p>${story.description}</p>
            <p><strong>Lokasi:</strong> ${story.location}</p>
          </div>
        `);
      }
    });
  }
}
