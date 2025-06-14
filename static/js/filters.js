let allArtists = [];
let activeFilter = "creation";

const creationMin = document.getElementById("creation-min-year-slider");
const creationMax = document.getElementById("creation-max-year-slider");
const albumMin = document.getElementById("album-min-year-slider");
const albumMax = document.getElementById("album-max-year-slider");
const membersMin = document.getElementById("members-min-slider");
const membersMax = document.getElementById("members-max-slider");

const creationMinLabel = document.getElementById("creation-min-year-label");
const creationMaxLabel = document.getElementById("creation-max-year-label");
const albumMinLabel = document.getElementById("album-min-year-label");
const albumMaxLabel = document.getElementById("album-max-year-label");
const membersMinLabel = document.getElementById("members-min-label");
const membersMaxLabel = document.getElementById("members-max-label");
const artistsContainer = document.getElementById("artists-container");
const searchInput = document.getElementById("search-input");
function setArtistData(data) {
  allArtists = data;
  updateFilterLabels();
  renderFilteredArtists();
}
function updateFilterLabels() {
  creationMinLabel.textContent = creationMin.value;
  creationMaxLabel.textContent = creationMax.value;
  albumMinLabel.textContent = albumMin.value;
  albumMaxLabel.textContent = albumMax.value;
  membersMinLabel.textContent = membersMin.value;
  membersMaxLabel.textContent = membersMax.value;
}

function updateFilters() {
  updateFilterLabels();
  renderFilteredArtists();
}

function getFilteredArtists() {
  const searchTerm = searchInput.value.toLowerCase().trim();

  return allArtists.filter((artist) => {
    const creationYear = artist.creationDate;

    // 🛠️ Парсим год из формата "DD-MM-YYYY"
    const albumYear = (() => {
      if (artist.firstAlbum && artist.firstAlbum.includes("-")) {
        const parts = artist.firstAlbum.split("-");
        return parseInt(parts[2]); // Берем именно год
      }
      return 0;
    })();

    const membersCount = artist.members.length;

    let match = true;

    if (activeFilter === "creation") {
      match =
        creationYear >= parseInt(creationMin.value) &&
        creationYear <= parseInt(creationMax.value);
    } else if (activeFilter === "album") {
      match =
        albumYear >= parseInt(albumMin.value) &&
        albumYear <= parseInt(albumMax.value);
    } else if (activeFilter === "members") {
      match =
        membersCount >= parseInt(membersMin.value) &&
        membersCount <= parseInt(membersMax.value);
    }

    if (searchTerm) {
      const nameMatch = artist.name.toLowerCase().includes(searchTerm);
      const memberMatch = artist.members.some((member) =>
        member.toLowerCase().includes(searchTerm)
      );
      return match && (nameMatch || memberMatch);
    }

    return match;
  });
}

function renderFilteredArtists() {
  const filtered = getFilteredArtists();
  artistsContainer.innerHTML = "";

  if (filtered.length === 0) {
    artistsContainer.innerHTML = `
      <p style="text-align: center; color: #6b7280; grid-column: 1 / -1;">
        No artists match the filter criteria.
      </p>`;
    return;
  }

  filtered.forEach((artist) => {
    const card = document.createElement("div");
    card.className = "artist-card";
    card.innerHTML = `
      <img src="${artist.image}" alt="${artist.name}">
      <div class="artist-card-content">
        <h2>${artist.name}</h2>
        <p>Formed: ${artist.creationDate}</p>
        <p>First Album: ${artist.firstAlbum}</p>
        <button data-id="${artist.id}" class="details-button">View Details</button>
      </div>
    `;

    card
      .querySelector(".details-button")
      .addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        window.location.href = `/details?id=${id}`;
      });

    artistsContainer.appendChild(card);
  });
}

[creationMin, creationMax, albumMin, albumMax, membersMin, membersMax].forEach(
  (slider) => slider.addEventListener("input", updateFilters)
);

document.querySelectorAll(".toggle-button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".toggle-button")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    activeFilter = btn.dataset.filter;

    document
      .getElementById("creation-date-filter-block")
      .classList.add("hidden");
    document.getElementById("album-date-filter-block").classList.add("hidden");
    document.getElementById("members-filter-block").classList.add("hidden");

    if (activeFilter === "creation") {
      document
        .getElementById("creation-date-filter-block")
        .classList.remove("hidden");
    } else if (activeFilter === "album") {
      document
        .getElementById("album-date-filter-block")
        .classList.remove("hidden");
    } else if (activeFilter === "members") {
      document
        .getElementById("members-filter-block")
        .classList.remove("hidden");
    }

    renderFilteredArtists();
  });
});

searchInput.addEventListener("input", renderFilteredArtists);

window.setArtistData = setArtistData;
