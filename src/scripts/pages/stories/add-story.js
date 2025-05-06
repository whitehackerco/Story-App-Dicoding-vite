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

class AddStoryPage {
  async render() {
    return `
      <section class="container">
        <h1>Tambah Cerita</h1>
        <form id="add-story-form">
          <div>
            <label for="story-description">Deskripsi:</label><br />
            <textarea id="story-description" name="description" required></textarea>
          </div>
          <div>
            <label for="story-photo">Foto:</label><br />
            <input type="file" id="story-photo" name="photo" accept="image/*" />
            <button type="button" id="open-camera-button">Gunakan Kamera</button>
            <video id="camera-stream" autoplay style="display: none; width: 100%;"></video>
            <canvas id="camera-canvas" style="display: none;"></canvas>
            <div id="camera-controls" style="display: none;">
              <button type="button" id="capture-photo-button">Ambil Gambar</button>
              <button type="button" id="delete-photo-button">Hapus Foto</button>
            </div>
          </div>
          <div>
            <label for="location-search">Cari Lokasi:</label><br />
            <input type="text" id="location-search" placeholder="Cari lokasi..." />
            <button type="button" id="search-location-button">Cari</button>
          </div>
          <div id="map" style="height: 400px; margin-top: 20px;"></div>
          <input type="hidden" id="latitude" name="latitude" />
          <input type="hidden" id="longitude" name="longitude" />
          <input type="hidden" id="location-name" name="location-name" />
          <button type="submit">Kirim Cerita</button>
        </form>
        <p id="form-message" style="color: red;"></p>
      </section>
    `;
  }

  async afterRender() {
    const openCameraButton = document.getElementById("open-camera-button");
    const cameraStream = document.getElementById("camera-stream");
    const cameraCanvas = document.getElementById("camera-canvas");
    const photoInput = document.getElementById("story-photo");
    const capturePhotoButton = document.getElementById("capture-photo-button");
    const deletePhotoButton = document.getElementById("delete-photo-button");
    const cameraControls = document.getElementById("camera-controls");
    let stream;

    // Sembunyikan tombol "Hapus Foto" secara default
    deletePhotoButton.style.display = "none";

    // Buka kamera
    openCameraButton.addEventListener("click", async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraStream.srcObject = stream;
        cameraStream.style.display = "block";
        cameraCanvas.style.display = "none";
        cameraControls.style.display = "block";

        // Sembunyikan tombol "Hapus Foto" saat kamera dibuka
        deletePhotoButton.style.display = "none";
      } catch (error) {
        console.error("Gagal membuka kamera:", error);
        alert("Tidak dapat mengakses kamera.");
      }
    });

    // Ambil gambar dari kamera
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

      // Konversi gambar ke Blob dan set ke input file
      cameraCanvas.toBlob((blob) => {
        const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        photoInput.files = dataTransfer.files;
      });

      // Nonaktifkan kamera
      stream.getTracks().forEach((track) => track.stop());
      cameraStream.style.display = "none";
      cameraCanvas.style.display = "block";
      cameraControls.style.display = "none";

      // Tampilkan tombol "Hapus Foto" setelah gambar diambil
      console.log("Menampilkan tombol Hapus Foto");
      deletePhotoButton.style.display = "inline-block";
    });

    // Hapus foto dan buka kamera kembali
    deletePhotoButton.addEventListener("click", () => {
      console.log("Tombol Hapus Foto diklik");

      // Kosongkan input file
      photoInput.value = "";
      cameraCanvas.style.display = "none";
      cameraStream.style.display = "block";
      cameraControls.style.display = "block";

      // Sembunyikan tombol "Hapus Foto" saat kamera dibuka kembali
      deletePhotoButton.style.display = "none";

      // Buka kembali kamera
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

    // Inisialisasi peta
    const map = L.map(mapContainer).setView([-6.2, 106.816666], 5); // Default ke Jakarta
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    let marker; // Variabel untuk menyimpan marker yang dipilih

    // Tambahkan marker saat peta diklik
    map.on("click", async (e) => {
      const { lat, lng } = e.latlng;

      // Hapus marker sebelumnya jika ada
      if (marker) {
        map.removeLayer(marker);
      }

      // Tambahkan marker baru
      marker = L.marker([lat, lng]).addTo(map);

      // Simpan koordinat ke input tersembunyi
      latitudeInput.value = lat;
      longitudeInput.value = lng;

      // Lakukan reverse geocoding untuk mendapatkan nama lokasi
      try {
        const locationResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const locationResult = await locationResponse.json();

        // Gunakan fallback jika city tidak tersedia
        const locationName =
          locationResult.address.city ||
          locationResult.address.town ||
          locationResult.address.village ||
          locationResult.address.state ||
          locationResult.address.country ||
          locationResult.display_name;

        // Simpan nama lokasi ke input tersembunyi
        locationNameInput.value = locationName;

        // Tampilkan popup dengan nama lokasi
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

    // Fitur pencarian lokasi
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

          // Pindahkan peta ke lokasi hasil pencarian
          map.setView([lat, lon], 13);

          // Hapus marker sebelumnya jika ada
          if (marker) {
            map.removeLayer(marker);
          }

          // Tambahkan marker baru
          marker = L.marker([lat, lon]).addTo(map);

          // Simpan koordinat dan nama lokasi ke input tersembunyi
          latitudeInput.value = lat;
          longitudeInput.value = lon;
          locationNameInput.value = display_name;

          // Tampilkan popup dengan nama lokasi
          marker
            .bindPopup(
              `
            <div>
              <p><strong>Lokasi:</strong> ${display_name}</p>
            </div>
          `
            )
            .openPopup();

          alert(`Lokasi ditemukan: ${display_name}`);
        } else {
          alert("Lokasi tidak ditemukan.");
        }
      } catch (error) {
        console.error("Error searching location:", error);
        alert("Gagal mencari lokasi. Coba lagi.");
      }
    });

    // Tambahkan event listener untuk submit form
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

        // Log respons dari server
        console.log("Response status:", response.status);
        const responseData = await response.json();
        console.log("Response data:", responseData);

        if (!response.ok) {
          throw new Error(responseData.message || "Gagal menambahkan cerita.");
        }

        alert("Cerita berhasil ditambahkan!");
        window.location.hash = "/stories"; // Redirect ke halaman Stories
      } catch (error) {
        console.error("Error adding story:", error);
        message.textContent = error.message || "Gagal menambahkan cerita.";
      }
    });
  }
}

export default AddStoryPage;
