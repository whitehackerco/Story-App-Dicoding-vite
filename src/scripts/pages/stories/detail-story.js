import L from "leaflet";
import "leaflet/dist/leaflet.css";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/images/marker-icon-2x.png",
  iconUrl: "/images/marker-icon.png",
  shadowUrl: "/images/marker-shadow.png",
});

import { StoryDetailPresenter } from "../../presenters/detailstory-presenter";

export default class StoryDetailPage {
  async render() {
    return `
      <section class="container">
        <div id="story-detail-content">Loading...</div>
      </section>
    `;
  }

  async afterRender() {
    const { id } = this.parseUrl();
    this.presenter = new StoryDetailPresenter(this);
    await this.presenter.loadDetail(id);
  }

  parseUrl() {
    const hash = window.location.hash;
    const match = hash.match(/\/stories\/([^/]+)/);
    return { id: match ? match[1] : null };
  }

  showLoading() {
    document.getElementById("story-detail-content").innerHTML =
      "<p>Loading...</p>";
  }

  async renderDetail(story) {
    const { getBookmark, addBookmark, deleteBookmark } = await import(
      "../../utils/bookmark-idb.js"
    );
    let isBookmarked = await getBookmark(story.id);

    document.getElementById("story-detail-content").innerHTML = `
      <div class="story-card">
        <img src="${story.photoUrl}" alt="${story.name}" class="story-image" />
        <div class="story-content">
          <h3 class="story-username">${story.name}</h3>
          <p class="story-description">${story.description}</p>
          <p class="story-date">${new Date(
            story.createdAt
          ).toLocaleString()}</p>
          <p class="story-location">Lat: ${story.lat ?? "-"}, Lon: ${
      story.lon ?? "-"
    }</p>
          <button id="bookmark-btn" class="btn-bookmark" title="Bookmark">
            <i class="${
              isBookmarked ? "fa-solid" : "fa-regular"
            } fa-bookmark"></i>
          </button>
        </div>
      </div>
      <div id="detail-map" style="height:300px;width:100%;margin:24px 0;border-radius:8px;"></div>
      <button id="back-btn" class="btn-cta" style="margin-top:24px;">← Back</button>
    `;

    if (story.lat && story.lon) {
      setTimeout(() => {
        const map = L.map("detail-map").setView([story.lat, story.lon], 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        L.marker([story.lat, story.lon])
          .addTo(map)
          .bindPopup(`<b>${story.name}</b><br>${story.description}`)
          .openPopup();
      }, 0);
    } else {
      document.getElementById("detail-map").innerHTML =
        "<p style='color:white;text-align:center;'>No Location for this Story.</p>";
    }

    const bookmarkBtn = document.getElementById("bookmark-btn");
    const icon = bookmarkBtn.querySelector("i");

    bookmarkBtn.onclick = async () => {
      if (icon.classList.contains("fa-regular")) {
        await addBookmark(story);
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
        bookmarkBtn.title = "Sudah di-bookmark";
      } else {
        await deleteBookmark(story.id);
        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");
        bookmarkBtn.title = "Bookmark";
      }
    };

    const backBtn = document.getElementById("back-btn");
    if (backBtn) {
      backBtn.onclick = () => window.history.back();
    }
  }

  showError(message) {
    document.getElementById(
      "story-detail-content"
    ).innerHTML = `<p>${message}</p>`;
  }
}
