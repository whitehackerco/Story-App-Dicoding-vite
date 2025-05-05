class AddStoryPage {
  async render() {
    return `
      <section class="container">
        <h1>Tambah Cerita</h1>
        <form id="add-story-form">
          <div>
            <label for="story-title">Judul Cerita:</label><br />
            <input type="text" id="story-title" name="title" required />
          </div>
          <div>
            <label for="story-description">Deskripsi:</label><br />
            <textarea id="story-description" name="description" required></textarea>
          </div>
          <div>
            <label for="story-photo">Foto:</label><br />
            <input type="file" id="story-photo" name="photo" accept="image/*" />
          </div>
          <button type="submit">Kirim Cerita</button>
        </form>
        <p id="form-message" style="color: red;"></p>
      </section>
    `;
  }

  async afterRender() {
    const form = document.querySelector("#add-story-form");
    const message = document.querySelector("#form-message");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const title = document.querySelector("#story-title").value.trim();
      const description = document
        .querySelector("#story-description")
        .value.trim();
      const photo = document.querySelector("#story-photo").files[0];

      if (!title || !description) {
        message.textContent = "Judul dan deskripsi wajib diisi.";
        return;
      }

      const token = localStorage.getItem("authToken");
      if (!token) {
        message.textContent = "Kamu harus login untuk mengirim cerita.";
        return;
      }

      const formData = new FormData();
      formData.append("description", description);
      if (photo) formData.append("photo", photo);

      try {
        const response = await fetch(
          "https://story-api.dicoding.dev/v1/stories",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        const result = await response.json();

        if (!result.error) {
          alert("Cerita berhasil ditambahkan!");
          window.location.hash = "/stories";
        } else {
          message.textContent = result.message || "Gagal menambahkan cerita.";
        }
      } catch (err) {
        message.textContent = "Terjadi kesalahan saat mengirim cerita.";
        console.error(err);
      }
    });
  }
}

export default AddStoryPage;
