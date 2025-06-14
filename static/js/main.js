document.addEventListener("DOMContentLoaded", function () {
  const artistsContainer = document.getElementById("artists-container");
  fetchArtists();
  async function fetchArtists() {
    try {
      const response = await fetch("/api/artists/", {
        headers: { "X-API-Key": "69d742de9375d0bfb12dc7438ce265ba" },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch artists");
      }
      const artists = await response.json();
      window.setArtistData(Array.isArray(artists) ? artists : []);
      renderArtists(Array.isArray(artists) ? artists : []);
    } catch (error) {
      console.error("Error fetching artists:", error);
      artistsContainer.innerHTML = `
        <p style="color: red; text-align: center; grid-column: 1 / -1;">
          Failed to load artists. Please try again later.
        </p>
      `;
    }
  }
  function renderArtists(artists) {
    artistsContainer.innerHTML = "";
    if (artists.length === 0) {
      artistsContainer.innerHTML = `
        <p style="text-align: center; color: #6b7280; grid-column: 1 / -1;">
          No artists found.
        </p>
      `;
      return;
    }
    artists.forEach((artist) => {
      const artistCard = document.createElement("div");
      artistCard.className = "artist-card";
      artistCard.innerHTML = `
        <img src="${artist.image}" alt="${artist.name}">
        <div class="artist-card-content">
          <h2>${artist.name}</h2>
          <p>Formed: ${artist.creationDate}</p>
          <p>First Album: ${artist.firstAlbum}</p>
          <button data-id="${artist.id}" class="details-button">
            View Details
          </button>
        </div>
      `;
      artistCard
        .querySelector(".details-button")
        .addEventListener("click", function () {
          const id = this.getAttribute("data-id");
          window.location.href = `/details?id=${id}`;
        });

      artistsContainer.appendChild(artistCard);
    });
  }
});
