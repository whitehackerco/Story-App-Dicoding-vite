export class AddStoryPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async handleMapClick(lat, lng) {
    try {
      const locationResult = await this.model.reverseGeocode(lat, lng);
      this.view.onLocationResolved(locationResult, lat, lng);
    } catch (error) {
      this.view.onLocationError(error.message);
    }
  }

  async handleLocationSearch(query) {
    try {
      const results = await this.model.searchLocation(query);
      this.view.onLocationSearchResult(results);
    } catch (error) {
      this.view.onLocationError(error.message);
    }
  }

  async handleSubmit({ description, photo, latitude, longitude }) {
    if (!description || !photo) {
      this.view.showError("Semua field wajib diisi!");
      return;
    }
    if (!photo.type.startsWith("image/")) {
      this.view.showError("File yang diunggah harus berupa gambar!");
      return;
    }
    if (photo.size > 1024 * 1024) {
      this.view.showError("Ukuran file tidak boleh lebih dari 1MB!");
      return;
    }

    try {
      await this.model.postStory({ description, photo, latitude, longitude });
      this.view.showSuccess("Cerita berhasil ditambahkan!");

      if ("Notification" in window && Notification.permission === "granted") {
        navigator.serviceWorker.getRegistration().then((reg) => {
          if (reg) {
            reg.showNotification("Story successfully created!", {
              body: `You have created a new story with a description: ${description}`,
            });
          }
        });
      }
    } catch (error) {
      this.view.showError(error.message || "Gagal menambahkan cerita.");
    }
  }
}
