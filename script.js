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

    //mapar igenom items (innehåller all data)
    const artistGenre = data.items.map((artist) => {
      const genreId = artist.fields.genre.sys.id;
      const stageId = artist.fields.stage.sys.id;

      const genre = data.includes.Entry.find(
        (entry) => entry.sys.id === genreId
      );

      //stage
      const stage = data.includes.Entry.find(
        (entry) => entry.sys.id === stageId
      );

      return {
        name: artist.fields.name,
        description: artist.fields.description,
        //genre
        genre: genre.fields.name,
        stage: stage.fields.name,
      };
    });
    const container = document.querySelector(".container-div");

    const artists = artistGenre
      .map((artist) => {
        return `
        <div class="card">
        <h3>${artist.name}</h3>
        <p>${artist.description}</p>
        <p>Genre:${artist.genre}</p>
        <p>Stage:${artist.stage}</p>
        </div>`;
      })
      .join("");

    container.innerHTML = artists;

    console.log(data);
  } catch (error) {
    console.log("Något blev fel med hämtningen utav api:et", error);
  }
};
fetchApi();
