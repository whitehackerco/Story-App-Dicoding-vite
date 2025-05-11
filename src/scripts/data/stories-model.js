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
            locationName =
              locationResult.address.city ||
              locationResult.address.town ||
              locationResult.address.village ||
              locationResult.address.state ||
              locationResult.address.country ||
              locationResult.display_name;
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
        };
      })
    );

    return storiesWithLocation;
  }
}
