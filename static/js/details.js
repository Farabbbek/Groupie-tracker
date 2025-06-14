document.addEventListener("DOMContentLoaded", async function () {
  const detailsContainer = document.getElementById("details-container");

  const params = new URLSearchParams(window.location.search);
  const artistId = params.get("id");

  if (!artistId) {
    detailsContainer.innerHTML =
      "<p style='color: red;'>No artist ID provided.</p>";
    return;
  }
  try {
    const response = await fetch(`/api/artists/${artistId}`, {
      headers: {
        "X-API-Key": "69d742de9375d0bfb12dc7438ce265ba",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch artist details");
    }

    const artist = await response.json();
    console.log("Fetched artist:", artist);

    renderArtistDetails(artist);
  } catch (error) {
    console.error("Error loading artist details:", error);
    detailsContainer.innerHTML =
      "<p style='color: red;'>Failed to load artist details.</p>";
  }

  function renderArtistDetails(artist) {
    const concertsHtml =
      artist.concerts && artist.concerts.length > 0
        ? artist.concerts
            .map((concert) => {
              const location = concert.location
                .replace(/_/g, " ")
                .replace(/-/g, ", ");
              const formattedDates = concert.dates.join("<br>");
              return `
            <div class="concert-item">
              <div class="concert-location">${location}</div>
              <p class="concert-dates">${formattedDates}</p>
            </div>
          `;
            })
            .join("")
        : "<p>No concert data available.</p>";

    const detailsHtml = `
      <div class="details-page-wrapper">
        <div class="details-grid-container">
          <div class="details-image-column">
            <img src="${artist.image}" alt="${artist.name}">
          </div>

          <div class="details-info-column">
            <h2 class="artist-main-title">${artist.name}</h2>

            <div class="details-section">
              <h3>Band Info</h3>
              <p><strong>Formed:</strong> ${artist.creationDate}</p>
              <p><strong>First Album:</strong> ${artist.firstAlbum}</p>
            </div>

            <div class="details-section">
              <h3>Members</h3>
              <ul class="members-list">
                ${artist.members.map((member) => `<li>${member}</li>`).join("")}
              </ul>
            </div>

            <div class="details-section">
              <h3>Concerts</h3>
              <div class="concerts-list">
                ${concertsHtml}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    detailsContainer.innerHTML = detailsHtml;
  }
});
