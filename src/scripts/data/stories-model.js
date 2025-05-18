export class StoriesModel {
  async fetchStories() {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      "https://story-api.dicoding.dev/v1/stories?location=1",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Gagal memuat cerita.");
    }

    const storiesWithLocation = await Promise.all(
      result.listStory.map(async (story) => {
        let locationName = "Tidak ada lokasi";
        if (story.lat && story.lon) {
          try {
            const locationResponse = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${story.lat}&lon=${story.lon}`
            );
            const locationResult = await locationResponse.json();

            if (locationResult.address) {
              locationName =
                locationResult.address.city ||
                locationResult.address.town ||
                locationResult.address.village ||
                locationResult.address.state ||
                locationResult.address.country ||
                locationResult.display_name;
            } else {
              locationName = "Tidak ada lokasi";
            }
          } catch (error) {
            console.error("Gagal mendapatkan nama lokasi:", error);
          }
        }

        return {
          photo: story.photoUrl,
          name: story.name,
          description: story.description,
          createdAt: story.createdAt,
          location: locationName,
          latitude: story.lat,
          longitude: story.lon,
        };
      })
    );

    return storiesWithLocation;
  }

  async postStory({ description, photo, latitude, longitude }) {
    const token = localStorage.getItem("authToken");
    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", photo);
    if (latitude) formData.append("lat", latitude);
    if (longitude) formData.append("lon", longitude);

    const response = await fetch("https://story-api.dicoding.dev/v1/stories", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Gagal menambahkan cerita.");
    }

    return result;
  }

  async reverseGeocode(lat, lng) {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    if (!response.ok) throw new Error("Gagal mendapatkan lokasi.");
    return await response.json();
  }

  async searchLocation(query) {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}`
    );
    if (!response.ok) throw new Error("Gagal mencari lokasi.");
    return await response.json();
  }
}
