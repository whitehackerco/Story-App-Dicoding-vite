import L from "leaflet";
import "leaflet/dist/leaflet.css";

class StoriesPage {
  async render() {
    return `
      <section class="container">
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
        "https://story-api.dicoding.dev/v1/stories?location=1",
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

      if (result.listStory.length === 0) {
        storiesList.innerHTML = "<p>Belum ada cerita yang tersedia.</p>";
        return;
      }

      const storiesHtml = await Promise.all(
        result.listStory.map(async (story) => {
          const date = new Date(story.createdAt).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          // Reverse geocoding untuk mendapatkan nama lokasi
          let locationText = "<p><strong>Lokasi:</strong> Tidak tersedia</p>";
          if (story.lat && story.lon) {
            try {
              const locationResponse = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${story.lat}&lon=${story.lon}`
              );
              const locationResult = await locationResponse.json();

              // Gunakan fallback jika city tidak tersedia
              const locationName =
                locationResult.address?.city ||
                locationResult.address?.town ||
                locationResult.address?.village ||
                locationResult.address?.state ||
                locationResult.address?.country ||
                locationResult.display_name;

              locationText = `<p><strong>Lokasi:</strong> ${locationName}</p>`;
            } catch (error) {
              console.error("Gagal mendapatkan lokasi:", error);
            }
          }

          return `
            <div class="story-card">
              <img src="${story.photoUrl}" alt="Foto cerita oleh ${story.name}" width="200" />
              <h3>${story.name}</h3>
              <p><strong>Tanggal:</strong> ${date}</p>
              <p>${story.description}</p>
              ${locationText}
            </div>
          `;
        })
      );

      storiesList.innerHTML = storiesHtml.join("");
    } catch (error) {
      console.error("Gagal memuat cerita:", error);
      storiesList.innerHTML = "<p>Terjadi kesalahan saat memuat cerita.</p>";
    }
  }
}

export default StoriesPage;
