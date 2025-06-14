document.addEventListener("DOMContentLoaded", function () {
  const artistsContainer = document.getElementById("artists-container");
  const searchInput = document.getElementById("search-input");
  const suggestionsBox = document.getElementById("search-suggestions");
  let allArtists = [];
  fetchArtists();
  async function fetchArtists() {
    try {
      const response = await fetch("/api/artists/", {
        headers: { "X-API-Key": "69d742de9375d0bfb12dc7438ce265ba" },
      });
      if (!response.ok) throw new Error("Network response was not ok.");

      const artists = await response.json();
      allArtists = Array.isArray(artists) ? artists : [];

      initializeSearch();
      renderArtists(allArtists);
    } catch (error) {
      console.error("Error fetching artists:", error);
      artistsContainer.innerHTML = `<p style="color: red;">Failed to load artists.</p>`;
    }
  }

  function initializeSearch() {
    if (allArtists.length === 0) return;

    searchInput.addEventListener("input", handleSearchInput);
    window.addEventListener("click", function (event) {
      if (!searchInput.contains(event.target)) {
        suggestionsBox.classList.add("hidden");
      }
    });
  }

  function handleSearchInput() {
    filterAndRender();
    generateAndShowSuggestions();
  }

  function generateAndShowSuggestions() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    suggestionsBox.innerHTML = "";

    if (!searchTerm) {
      suggestionsBox.classList.add("hidden");
      return;
    }

    const suggestions = [];
    const maxSuggestions = 7;

    for (const artist of allArtists) {
      if (artist.name.toLowerCase().includes(searchTerm)) {
        suggestions.push({ text: artist.name, type: "Band" });
      }
      for (const member of artist.members) {
        if (member.toLowerCase().includes(searchTerm)) {
          suggestions.push({ text: member, type: `Member in ${artist.name}` });
        }
      }
    }

    if (suggestions.length > 0) {
      suggestionsBox.classList.remove("hidden");
      suggestions.slice(0, maxSuggestions).forEach((suggestion) => {
        const item = document.createElement("div");
        item.className = "suggestion-item";
        item.innerHTML = `
            <span class="suggestion-text">${suggestion.text}</span>
            <span class="suggestion-type">${suggestion.type}</span>
          `;
        item.addEventListener("click", function () {
          searchInput.value = suggestion.text;
          suggestionsBox.classList.add("hidden");
          filterAndRender();
        });
        suggestionsBox.appendChild(item);
      });
    } else {
      suggestionsBox.classList.add("hidden");
    }
  }
  function filterAndRender() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    let filteredArtists = allArtists;
    if (searchTerm) {
      filteredArtists = allArtists.filter(
        (artist) =>
          artist.name.toLowerCase().includes(searchTerm) ||
          artist.members.some((member) =>
            member.toLowerCase().includes(searchTerm)
          )
      );
    }

    renderArtists(filteredArtists);
  }
  function renderArtists(artists) {
    artistsContainer.innerHTML = "";
    if (artists.length === 0) {
      artistsContainer.innerHTML = `<p style="text-align: center;">No artists found matching your criteria.</p>`;
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
            <button data-id="${artist.id}" class="details-button">View Details</button>
          </div>
        `;
      artistsContainer.appendChild(artistCard);
      artistCard
        .querySelector(".details-button")
        .addEventListener("click", function () {
          const id = this.getAttribute("data-id");
          window.location.href = `/details?id=${id}`;
        });
    });
  }
});
