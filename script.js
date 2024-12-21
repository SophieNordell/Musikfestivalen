const spaceId = localStorage.getItem("spaceId");
const accessToken = localStorage.getItem("accessToken");
const url = `https://cdn.contentful.com/spaces/${spaceId}/entries?access_token=${accessToken}&content_type=artist`;

const fetchApi = async () => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(" Något gick fel.");
    }
    const data = await response.json();

    // Samla artist- och genredata
    const artistGenre = data.items.map((artist) => {
      const genreId = artist.fields.genre.sys.id;
      const stageId = artist.fields.stage.sys.id;
      const dayId = artist.fields.day.sys.id;

      const genre = data.includes.Entry.find(
        (entry) => entry.sys.id === genreId
      );

      // Stage
      const stage = data.includes.Entry.find(
        (entry) => entry.sys.id === stageId
      );
      //day
      const day = data.includes.Entry.find((entry) => entry.sys.id === dayId);

      return {
        name: artist.fields.name,
        description: artist.fields.description,
        // Genre
        genre: genre.fields.name,
        stage: stage.fields.name,
        day: day.fields.description,
      };
    });

    // Hämta unika genrer
    const genres = [...new Set(artistGenre.map((artist) => artist.genre))];

    // Fyll dropdown med genrer
    const genreSelect = document.getElementById("genre-select");
    genres.forEach((genre) => {
      const option = document.createElement("option");
      option.value = genre;
      option.textContent = genre;
      genreSelect.appendChild(option);
    });

    const container = document.querySelector(".container-div");

    // Funktion för att rendera artister
    const renderArtists = (filteredArtists) => {
      const artists = filteredArtists
        .map((artist) => {
          return `
          <div class="card">
          <h3>${artist.name}</h3>
          <p>${artist.description}</p>
          <p><span>Genre:</span> ${artist.genre}</p>
          <p><span>Stage:</span> ${artist.stage}</p>
           <p><span>When:</span> ${artist.day}</p>
          </div>`;
        })
        .join("");

      container.innerHTML = artists;
    };

    // Visa alla artister som standard
    renderArtists(artistGenre);

    // Lyssna på ändring av dropdown
    genreSelect.addEventListener("change", (event) => {
      const selectedGenre = event.target.value;

      if (selectedGenre === "all") {
        renderArtists(artistGenre); // Visa alla artister
      } else {
        const filteredArtists = artistGenre.filter(
          (artist) => artist.genre === selectedGenre
        );
        renderArtists(filteredArtists); // Visa filtrerade artister
      }
    });

    console.log(data);
  } catch (error) {
    console.log("Något blev fel med hämtningen utav api:et", error);
  }
};
fetchApi();
