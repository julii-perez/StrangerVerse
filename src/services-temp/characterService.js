
const API_URL = "https://hawapi.theproject.id/api/v1";

function extractItems(result) {
  if (Array.isArray(result)) return result;

  const possible =
    result?.content ??
    result?.data ??
    result?.results ??
    result?.items ??
    [];

  if (Array.isArray(possible)) return possible;

  if (possible && typeof possible === "object") {
    return extractItems(possible);
  }

  return [];
}

async function getPage(resource, page = 1) {
  const params = new URLSearchParams({
    page: String(page),
    size: "20"
  });

  const response = await fetch(
    `${API_URL}/${resource}?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(
      `Error consultando ${resource}: ${response.status}`
    );
  }

  const data = await response.json();

  return {
    items: extractItems(data),
    totalPages:
      Number(response.headers.get("X-Pagination-Page-Total")) || 1
  };
}

// Obtiene todos los registros disponibles.
async function getAll(resource) {
  const firstPage = await getPage(resource, 1);
  const items = [...firstPage.items];

  for (let page = 2; page <= firstPage.totalPages; page++) {
    const result = await getPage(resource, page);
    items.push(...result.items);
  }

  return items;
}

async function getOne(resource, uuid) {
  const response = await fetch(
    `${API_URL}/${resource}/${uuid}`
  );

  if (!response.ok) {
    throw new Error(
      `No se pudo consultar ${resource}: ${response.status}`
    );
  }

  return response.json();
}

// PERSONAJES
export async function getCharacters() {
  return getAll("characters");
}

export async function getCharacterById(uuid) {
  return getOne("characters", uuid);
}

// ACTORES
export async function getActors() {
  return getAll("actors");
}

export async function getActorById(uuid) {
  return getOne("actors", uuid);
}

// EPISODIOS
export async function getEpisodes() {
  return getAll("episodes");
}

export async function getEpisodeById(uuid) {
  return getOne("episodes", uuid);
}

// TEMPORADAS
export async function getSeasons() {
  return getAll("seasons");
}

export async function getSeasonById(uuid) {
  return getOne("seasons", uuid);
}
