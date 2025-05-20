export default class BookmarkPage {
  async render() {
    return `
      <section class="container">
        <h2 class="bookmark-title">Bookmark Stories</h2>
        <div id="bookmark-list" class="stories-list"></div>
      </section>
    `;
  }

  async afterRender() {
    const { getAllBookmarks } = await import("../utils/bookmark-idb.js");
    const bookmarks = await getAllBookmarks();
    const list = document.getElementById("bookmark-list");
    if (bookmarks.length === 0) {
      list.innerHTML = "<p class='bookmark-empty'>Bookmark is empty.</p>";
      return;
    }

    const locations = await Promise.all(
      bookmarks.map((story) => getCityCountry(story.lat, story.lon))
    );

    list.innerHTML = bookmarks
      .map(
        (story, i) => `
      <div class="story-card">
        <a href="#/stories/${story.id}">
          <img src="${story.photoUrl || story.photo}" alt="${
          story.name
        }" class="story-image"/>
        </a>
        <div class="story-content">
          <h3 class="story-username">${story.name}</h3>
          <p class="story-description">${story.description}</p>
          <p class="story-date">${
            story.createdAt ? new Date(story.createdAt).toLocaleString() : "-"
          }</p>
          <p class="story-location">${locations[i]}</p>
          <div class="story-actions">
            <a href="#/stories/${
              story.id
            }" class="btn-cta btn-detail">Detail</a>
          </div>
        </div>
      </div>
    `
      )
      .join("");
  }
}

async function getCityCountry(lat, lon) {
  if (!lat || !lon) return "-";
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`
    );
    const data = await res.json();
    const city =
      data.address.city ||
      data.address.town ||
      data.address.village ||
      data.address.county ||
      "-";
    const country = data.address.country || "-";
    return `${city}, ${country}`;
  } catch {
    return "-";
  }
}
