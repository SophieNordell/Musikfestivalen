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

    const formatDateAndTime = (dateString) => {
      const date = new Date(dateString);
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return date.toLocaleDateString("sv-SE", options);
    };

    // Bildkoppling till artistnamn
    const artistImage = {
      "Ariana Grande": "./img/ariana.png",
      "Travis Scott": "./img/travis.png",
      "Snarky Puppy": "./img/snarkypuppy.png",
      "Imagine Dragons": "./img/imaginedragon.png",
      "The Lumineers": "./img/TheLumineers.png",
      Drake: "./img/drake.png",
      "Billie Eilish": "./img/billie.png",
      Slipknot: "./img/slipknot.png",
      "The Weeknd": "./img/theweeknd.png",
      Metallica: "./img/metallica.png",
    };

    // Samla artist och genredata
    const artists = data.items.map((artist) => {
      const genreId = artist.fields.genre.sys.id;
      const stageId = artist.fields.stage.sys.id;
      const dayId = artist.fields.day.sys.id;
      const dateId = artist.fields.day.sys.id;

      const genre = data.includes.Entry.find(
        (entry) => entry.sys.id === genreId
      );

      const stage = data.includes.Entry.find(
        (entry) => entry.sys.id === stageId
      );

      const day = data.includes.Entry.find((entry) => entry.sys.id === dayId);

      const date = data.includes.Entry.find((entry) => entry.sys.id === dateId);

      return {
        name: artist.fields.name,
        image: artistImage[artist.fields.name],
        description: artist.fields.description,
        genre: genre.fields.name,
        stage: stage.fields.name,
        day: day.fields.description,
        date: formatDateAndTime(date.fields.date),
      };
    });

    // Hämta unika genrer
    const genres = [...new Set(artists.map((artist) => artist.genre))];

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
      const artistCards = filteredArtists
        .map((artist) => {
          return `
          <div class="card">
            <h3>${artist.name}</h3>
            <img src="${artist.image}" alt="${artist.name}" class="artist-img" />
            <p>${artist.description}</p>
            <p><span>Genre:</span> ${artist.genre}</p>
            <p><span>Stage:</span> ${artist.stage}</p>
            <p><span>When:</span> ${artist.day} (${artist.date})</p>
          </div>`;
        })
        .join("");

      container.innerHTML = artistCards;
    };

    // Visa alla artister som standard
    renderArtists(artists);

    // Lyssna på ändring av dropdown
    genreSelect.addEventListener("change", (event) => {
      const selectedGenre = event.target.value;

      if (selectedGenre === "all") {
        renderArtists(artists);
      } else {
        const filteredArtists = artists.filter(
          (artist) => artist.genre === selectedGenre
        );
        renderArtists(filteredArtists);
      }
    });

    console.log(data);
  } catch (error) {
    console.log("Något blev fel med hämtningen utav api:et", error);
  }
};

fetchApi();
