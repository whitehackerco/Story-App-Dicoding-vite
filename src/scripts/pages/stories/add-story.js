import L from "leaflet";
import "leaflet/dist/leaflet.css";
import CameraManager from "../../utils/camera-manager";
import { StoriesModel } from "../../data/stories-model";
import { AddStoryPresenter } from "../../presenters/add-story-presenter";

class AddStoryPage {
  constructor() {
    this.cameraStream = null;
    this.presenter = null;
    this.map = null;
    this.marker = null;
  }

  async render() {
    return `
    <section class="add-story container">
      <h2 class="form-title">New Story</h2>
      <form id="add-story-form" class="add-story-form">
        <div class="form-group">
          <label for="story-description">Story Description:</label>
          <textarea id="story-description" name="description" required placeholder="Write your story..."></textarea>
        </div>

        <div class="form-group">
          <label></label>
          <div class="photo-buttons">
            <label for="story-photo" class="fa-button">
              <i class="fa-solid fa-images" style="color: #000000"></i> Choose File
            </label>
            <input type="file" id="story-photo" name="photo" accept="image/*" style="display: none;" />

            <button type="button" id="open-camera-button" class="fa-button">
              <i class="fa-solid fa-camera"></i> Open Camera
            </button>

            <button type="button" id="delete-photo-button" class="fa-button danger">
              <i class="fa-regular fa-circle-xmark"></i> Hapus
            </button>
          </div>
        </div>

        <div class="camera-container">
          <video id="camera-stream" autoplay style="display: none;"></video>
          <canvas id="camera-canvas" style="display: none;"></canvas>

          <div id="camera-controls" class="camera-controls" style="display: none;">
            <button type="button" id="capture-photo-button" class="fa-button"><i class="fa-solid fa-circle-dot" style="color: #000000"></i></button>
            <button type="button" id="cancel-camera-button" class="fa-button"><i class="fa-solid fa-circle-minus" style="color: #000000"></i></button>
          </div>
        </div>

        <div class="form-group">
          <label for="location-search">Search Location:</label>
          <div class="location-search">
            <input type="text" id="location-search" placeholder="Jakarta" />
            <button type="button" id="search-location-button" class="fa-button icon-button"><i class="fa-solid fa-magnifying-glass-location" style="color:#000000;"></i></button>
          </div>
        </div>

        <div id="map" class="map-container"></div>

        <input type="hidden" id="latitude" name="latitude" />
        <input type="hidden" id="longitude" name="longitude" />
        <input type="hidden" id="location-name" name="location-name" />

        <button type="submit" class="submit-button">Post</button>
        <p id="form-message" class="form-message"></p>
      </form>

      <div id="success-popup" class="popup hidden">
          <p id="popup-message">Cerita berhasil ditambahkan!</p>
        </div>
    </section>
  `;
  }

  async afterRender() {
    this.presenter = new AddStoryPresenter(new StoriesModel(), this);

    const openCameraButton = document.getElementById("open-camera-button");
    const cancelCameraButton = document.getElementById("cancel-camera-button");
    const cameraStream = document.getElementById("camera-stream");
    const cameraCanvas = document.getElementById("camera-canvas");
    const photoInput = document.getElementById("story-photo");
    const capturePhotoButton = document.getElementById("capture-photo-button");
    const deletePhotoButton = document.getElementById("delete-photo-button");
    const cameraControls = document.getElementById("camera-controls");
    let stream;

    deletePhotoButton.style.display = "none";

    openCameraButton.addEventListener("click", async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        CameraManager.addStream(stream);
        cameraStream.srcObject = stream;
        cameraStream.style.display = "block";
        cameraCanvas.style.display = "none";
        cameraControls.style.display = "block";

        deletePhotoButton.style.display = "none";
      } catch (error) {
        console.error("Gagal membuka kamera:", error);
        alert("Tidak dapat mengakses kamera.");
      }
    });

    cancelCameraButton.addEventListener("click", () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      cameraStream.style.display = "none";
      cameraControls.style.display = "none";
      deletePhotoButton.style.display = "none";
    });

    capturePhotoButton.addEventListener("click", () => {
      const context = cameraCanvas.getContext("2d");
      cameraCanvas.width = cameraStream.videoWidth;
      cameraCanvas.height = cameraStream.videoHeight;
      context.drawImage(
        cameraStream,
        0,
        0,
        cameraCanvas.width,
        cameraCanvas.height
      );

      cameraCanvas.toBlob((blob) => {
        const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        photoInput.files = dataTransfer.files;
      });

      stream.getTracks().forEach((track) => track.stop());
      cameraStream.style.display = "none";
      cameraCanvas.style.display = "block";
      cameraControls.style.display = "none";

      deletePhotoButton.style.display = "inline-block";
    });

    deletePhotoButton.addEventListener("click", () => {
      photoInput.value = "";
      cameraCanvas.style.display = "none";
      cameraStream.style.display = "block";
      cameraControls.style.display = "block";

      deletePhotoButton.style.display = "none";

      navigator.mediaDevices.getUserMedia({ video: true }).then((newStream) => {
        stream = newStream;
        CameraManager.addStream(newStream);
        cameraStream.srcObject = newStream;
      });
    });

    const mapContainer = document.getElementById("map");
    const latitudeInput = document.getElementById("latitude");
    const longitudeInput = document.getElementById("longitude");
    const locationNameInput = document.getElementById("location-name");
    const form = document.getElementById("add-story-form");
    const message = document.getElementById("form-message");

    const map = L.map(mapContainer).setView([-6.2, 106.816666], 5);
    this.map = map;

    const openStreetMap = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    );

    const mapTilerSatellite = L.tileLayer(
      "https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=MAPTILER_KEY",
      {
        attribution:
          '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> contributors',
      }
    );

    openStreetMap.addTo(map);

    const baseLayers = {
      OpenStreetMap: openStreetMap,
      "Satellite (MapTiler)": mapTilerSatellite,
    };

    L.control.layers(baseLayers).addTo(map);

    let marker;

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      this.presenter.handleMapClick(lat, lng);
    });

    const searchInput = document.getElementById("location-search");
    const searchButton = document.getElementById("search-location-button");

    searchButton.addEventListener("click", () => {
      const query = searchInput.value.trim();
      if (!query) {
        alert("Masukkan lokasi untuk mencari.");
        return;
      }
      this.presenter.handleLocationSearch(query);
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const description = document
        .getElementById("story-description")
        .value.trim();
      const photo = document.getElementById("story-photo").files[0];
      const latitude = document.getElementById("latitude").value;
      const longitude = document.getElementById("longitude").value;

      this.presenter.handleSubmit({ description, photo, latitude, longitude });
    });
  }

  stopCamera() {
    if (this.cameraStream) {
      const tracks = this.cameraStream.getTracks();
      tracks.forEach((track) => track.stop());
      this.cameraStream = null;
    }
  }

  beforeUnmount() {
    CameraManager.stopAllStreams();
  }

  showError(message) {
    document.getElementById("form-message").textContent = message;
  }

  showSuccess(message) {
    document.getElementById("form-message").textContent = message;
  }

  showSuccessPopup(message) {
    const popup = document.getElementById("success-popup");
    const popupMessage = document.getElementById("popup-message");
    if (popup && popupMessage) {
      popupMessage.textContent = message;
      popup.classList.remove("hidden");
      popup.classList.add("show");
      setTimeout(() => {
        popup.classList.remove("show");
        popup.classList.add("hidden");
      }, 2000);
    }
  }

  onLocationResolved(locationResult, lat, lng) {
    const locationNameInput = document.getElementById("location-name");
    const latitudeInput = document.getElementById("latitude");
    const longitudeInput = document.getElementById("longitude");

    const address = locationResult.address || {};
    const parts = [
      address.road,
      address.neighbourhood,
      address.suburb,
      address.village,
      address.town,
      address.city,
      address.state,
      address.country,
    ].filter(Boolean);

    const locationName =
      parts.length > 0 ? parts.join(", ") : locationResult.display_name;

    locationNameInput.value = locationName;
    latitudeInput.value = lat;
    longitudeInput.value = lng;

    if (!this.marker) {
      this.marker = L.marker([lat, lng]).addTo(this.map);
    } else {
      this.marker.setLatLng([lat, lng]);
    }
    this.marker.bindPopup(`<b>${locationName}</b>`).openPopup();
    this.map.setView([lat, lng], 13);
  }

  onLocationSearchResult(results) {
    if (
      results.length > 0 &&
      results[0].lat &&
      results[0].lon &&
      results[0].display_name
    ) {
      const { lat, lon, display_name } = results[0];

      document.getElementById("location-name").value = display_name;
      document.getElementById("latitude").value = lat;
      document.getElementById("longitude").value = lon;

      if (!this.marker) {
        this.marker = L.marker([lat, lon]).addTo(this.map);
      } else {
        this.marker.setLatLng([lat, lon]);
      }
      this.marker.bindPopup(`<b>${display_name}</b>`).openPopup();
      this.map.setView([lat, lon], 13);

      this.showSuccessPopup(`Lokasi ditemukan: ${display_name}`);
    } else if (results.length === 0) {
      alert("Lokasi tidak ditemukan.");
    } else {
      alert("Data lokasi tidak lengkap.");
    }
  }

  onLocationError(message) {
    alert(message);
  }
}

export default AddStoryPage;
