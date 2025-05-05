class StoriesPage {
  async render() {
    return `
      <section class="container">
        <h1>Daftar Cerita</h1>
        <div id="stories-list">Loading...</div>
      </section>
    `;
  }

  async afterRender() {
    const storiesList = document.getElementById("stories-list");
    const token = localStorage.getItem("authToken");

    if (!token) {
      storiesList.innerHTML = "<p>Kamu harus login untuk melihat cerita.</p>";
      return;
    }

    try {
      const response = await fetch(
        "https://story-api.dicoding.dev/v1/stories",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (result.error) {
        storiesList.innerHTML = `<p>${result.message}</p>`;
        return;
      }

      const storiesHtml = result.listStory
        .map(
          (story) => `
          <div class="story-card">
            <h3>${story.name}</h3>
            <img src="${story.photoUrl}" alt="Story Image" width="200" />
            <p>${story.description}</p>
          </div>
        `
        )
        .join("");

      storiesList.innerHTML = storiesHtml;
    } catch (error) {
      console.error("Gagal memuat cerita:", error);
      storiesList.innerHTML = "<p>Terjadi kesalahan saat memuat cerita.</p>";
    }
  }
}

export default StoriesPage;
