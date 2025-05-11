import L from "leaflet";
import "leaflet/dist/leaflet.css";

async function fetchStories() {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Kamu harus login untuk melihat cerita.");
  }

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

  return result.listStory;
}

async function postStory() {
  try {
    const response = await fetch("https://api.example.com/stories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({
        description: "Deskripsi cerita",
        photo: "URL foto",
      }),
    });

    if (!response.ok) {
      throw new Error("Gagal menambahkan cerita");
    }

    showSuccessPopup("Cerita berhasil ditambahkan!");
  } catch (error) {
    console.error(error);
    alert("Terjadi kesalahan. Silakan coba lagi.");
  }
}

function showSuccessPopup(message) {
  const popup = document.getElementById("success-popup");
  const popupMessage = document.getElementById("popup-message");

  popupMessage.textContent = message;
  popup.classList.remove("hidden");
  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
    popup.classList.add("hidden");
  }, 3000);
}

class AddStoryPage {
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
      console.log("Tombol Batalkan diklik");

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      cameraStream.style.display = "none";
      cameraControls.style.display = "none";
      deletePhotoButton.style.display = "none";
    });

    capturePhotoButton.addEventListener("click", () => {
      console.log("Tombol Ambil Gambar diklik");

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

      console.log("Menampilkan tombol Hapus Foto");
      deletePhotoButton.style.display = "inline-block";
    });

    deletePhotoButton.addEventListener("click", () => {
      console.log("Tombol Hapus Foto diklik");

      photoInput.value = "";
      cameraCanvas.style.display = "none";
      cameraStream.style.display = "block";
      cameraControls.style.display = "block";

      deletePhotoButton.style.display = "none";

      navigator.mediaDevices.getUserMedia({ video: true }).then((newStream) => {
        stream = newStream;
        cameraStream.srcObject = stream;
      });
    });

    const mapContainer = document.getElementById("map");
    const latitudeInput = document.getElementById("latitude");
    const longitudeInput = document.getElementById("longitude");
    const locationNameInput = document.getElementById("location-name");
    const form = document.getElementById("add-story-form");
    const message = document.getElementById("form-message");

    const map = L.map(mapContainer).setView([-6.2, 106.816666], 5);

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

    map.on("click", async (e) => {
      const { lat, lng } = e.latlng;

      if (marker) {
        map.removeLayer(marker);
      }

      marker = L.marker([lat, lng]).addTo(map);

      latitudeInput.value = lat;
      longitudeInput.value = lng;

      try {
        const locationResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const locationResult = await locationResponse.json();

        const locationName =
          locationResult.address.city ||
          locationResult.address.town ||
          locationResult.address.village ||
          locationResult.address.state ||
          locationResult.address.country ||
          locationResult.display_name;

        locationNameInput.value = locationName;

        marker
          .bindPopup(
            `
            <div>
              <p><strong>Lokasi:</strong> ${locationName}</p>
              <p><strong>Kota:</strong> ${
                locationResult.address.city || "Tidak tersedia"
              }</p>
              <p><strong>Negara:</strong> ${
                locationResult.address.country || "Tidak tersedia"
              }</p>
            </div>
          `
          )
          .openPopup();
      } catch (error) {
        console.error("Gagal mendapatkan lokasi:", error);
        marker.bindPopup("<p>Gagal mendapatkan lokasi.</p>").openPopup();
      }
    });

    const searchInput = document.getElementById("location-search");
    const searchButton = document.getElementById("search-location-button");

    searchButton.addEventListener("click", async () => {
      const query = searchInput.value.trim();
      if (!query) {
        alert("Masukkan lokasi untuk mencari.");
        return;
      }

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
        );
        const results = await response.json();

        if (results.length > 0) {
          const { lat, lon, display_name } = results[0];

          map.setView([lat, lon], 13);

          if (marker) {
            map.removeLayer(marker);
          }

          marker = L.marker([lat, lon]).addTo(map);

          latitudeInput.value = lat;
          longitudeInput.value = lon;
          locationNameInput.value = display_name;

          marker
            .bindPopup(
              `
            <div>
              <p><strong>Lokasi:</strong> ${display_name}</p>
            </div>
          `
            )
            .openPopup();

          showSuccessPopup(`Lokasi ditemukan: ${display_name}`);
        } else {
          alert("Lokasi tidak ditemukan.");
        }
      } catch (error) {
        console.error("Error searching location:", error);
        alert("Gagal mencari lokasi. Coba lagi.");
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const description = document
        .getElementById("story-description")
        .value.trim();
      const photo = document.getElementById("story-photo").files[0];
      const latitude = latitudeInput.value;
      const longitude = longitudeInput.value;

      if (!description || !photo) {
        message.textContent = "Semua field wajib diisi!";
        return;
      }

      if (!photo.type.startsWith("image/")) {
        message.textContent = "File yang diunggah harus berupa gambar!";
        return;
      }

      if (photo.size > 1024 * 1024) {
        message.textContent = "Ukuran file tidak boleh lebih dari 1MB!";
        return;
      }

      const formData = new FormData();
      formData.append("description", description);
      formData.append("photo", photo);
      if (latitude) formData.append("lat", latitude);
      if (longitude) formData.append("lon", longitude);

      try {
        const response = await fetch(
          "https://story-api.dicoding.dev/v1/stories",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: formData,
          }
        );

        console.log("Response status:", response.status);
        const responseData = await response.json();
        console.log("Response data:", responseData);

        if (!response.ok) {
          throw new Error(responseData.message || "Gagal menambahkan cerita.");
        }

        showSuccessPopup("Cerita berhasil ditambahkan!");
        setTimeout(() => {
          window.location.hash = "/stories";
        }, 3000);
      } catch (error) {
        console.error("Error adding story:", error);
        message.textContent = error.message || "Gagal menambahkan cerita.";
      }
    });
  }
}

export default AddStoryPage;
