
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  X,
  Tv,
  Users,
  Clapperboard,
  Layers,
  Clock3,
  CalendarDays,
  ArrowUpRight,
  Play,
  Radio,
  LoaderCircle
} from "lucide-react";

import {
  getCharacters,
  getActors,
  getEpisodes,
  getSeasons
} from "./services-temp/characterService";

const sections = [
  { id: "characters", label: "Personajes", icon: Users },
  { id: "actors", label: "Actores", icon: Radio },
  { id: "episodes", label: "Episodios", icon: Clapperboard },
  { id: "seasons", label: "Temporadas", icon: Layers }
];

function getName(item) {
  return [
    item?.first_name,
    item?.last_name
  ].filter(Boolean).join(" ") || item?.title || "Sin nombre";
}

function getImageCandidates(item) {
  const images = [
    item?.thumbnail,
    ...(Array.isArray(item?.images) ? item.images : [])
  ];

  return [...new Set(
    images.filter(
      (url) =>
        typeof url === "string" &&
        /^https?:\/\//i.test(url)
    )
  )];
}

function ApiImage({ item, alt }) {
  const images = getImageCandidates(item);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    setImageIndex(0);
  }, [item?.uuid]);

  const image = images[imageIndex];

  if (!image) {
    return (
      <div className="image-fallback">
        <Tv size={36} />
        <span>IMAGEN NO DISPONIBLE</span>
      </div>
    );
  }

  return (
    <img
      src={image}
      alt={alt}
      loading="lazy"
      onError={() => setImageIndex((current) => current + 1)}
    />
  );
}

function getUuidFromPath(path) {
  if (!path) return "";

  const parts = String(path).split("/");
  return parts[parts.length - 1];
}

function formatDate(date) {
  if (!date) return "No disponible";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function formatDuration(milliseconds) {
  if (!milliseconds) return "Duración no disponible";

  const minutes = Math.round(milliseconds / 60000);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${minutes} min`;

  return `${hours} h ${remainingMinutes} min`;
}

function App() {
  const [characters, setCharacters] = useState([]);
  const [actors, setActors] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [seasons, setSeasons] = useState([]);

  const [activeSection, setActiveSection] = useState("characters");
  const [search, setSearch] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [
          charactersData,
          actorsData,
          episodesData,
          seasonsData
        ] = await Promise.all([
          getCharacters(),
          getActors(),
          getEpisodes(),
          getSeasons()
        ]);

        if (!active) return;

        setCharacters(charactersData);
        setActors(actorsData);
        setEpisodes(episodesData);
        setSeasons(seasonsData);
      } catch (err) {
        if (active) {
          setError(
            err.message || "No fue posible cargar la información."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const term = search.toLowerCase().trim();

    let items = [];

    if (activeSection === "characters") items = characters;
    if (activeSection === "actors") items = actors;
    if (activeSection === "episodes") items = episodes;
    if (activeSection === "seasons") items = seasons;

    if (activeSection === "episodes" && selectedSeason !== "all") {
      items = items.filter((episode) => {
        return (
          getUuidFromPath(episode.season) === selectedSeason
        );
      });
    }

    if (!term) return items;

    return items.filter((item) => {
      const searchable = [
        getName(item),
        item.description,
        item.title,
        ...(item.nicknames || [])
      ].filter(Boolean).join(" ").toLowerCase();

      return searchable.includes(term);
    });
  }, [
    activeSection,
    characters,
    actors,
    episodes,
    seasons,
    search,
    selectedSeason
  ]);

  function changeSection(section) {
    setActiveSection(section);
    setSearch("");
    setSelectedSeason("all");
    setSelectedItem(null);
  }

  function getActorForCharacter(character) {
    const actorUuid = getUuidFromPath(character.actor);

    return actors.find((actor) => {
      const characterUuid = getUuidFromPath(actor.character);

      return (
        actor.uuid === actorUuid ||
        characterUuid === character.uuid
      );
    });
  }

  function getCharacterForActor(actor) {
    const characterUuid = getUuidFromPath(actor.character);

    return characters.find(
      (character) => character.uuid === characterUuid
    );
  }

  function getSeasonTitle(episode) {
    const seasonUuid = getUuidFromPath(episode.season);

    const season = seasons.find(
      (item) => item.uuid === seasonUuid
    );

    return season?.title || "Temporada no identificada";
  }

  function renderCard(item) {
    const isEpisode = activeSection === "episodes";
    const isSeason = activeSection === "seasons";
    const isCharacter = activeSection === "characters";
    const relatedActor = isCharacter
      ? getActorForCharacter(item)
      : null;
    const relatedCharacter = activeSection === "actors"
      ? getCharacterForActor(item)
      : null;

    return (
      <article
        className="data-card"
        key={item.uuid}
        onClick={() => setSelectedItem(item)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            setSelectedItem(item);
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="card-image">
          <ApiImage
            item={item}
            alt={getName(item)}
          />

          <div className="card-image-shade" />

          <span className="card-number">
            {isEpisode
              ? `EP. ${item.episode_num || "—"}`
              : isSeason
                ? `TEMPORADA ${item.season_num || item.season || "—"}`
                : "HAWKINS"}
          </span>

          <span className="card-open">
            <ArrowUpRight size={19} />
          </span>
        </div>

        <div className="card-content">
          <span className="eyebrow">
            {isCharacter
              ? "PERSONAJE"
              : activeSection === "actors"
                ? "ACTOR / ACTRIZ"
                : isEpisode
                  ? getSeasonTitle(item)
                  : "TEMPORADA"}
          </span>

          <h3>{getName(item)}</h3>

          <p>
            {isCharacter && relatedActor
              ? `Interpretado por ${getName(relatedActor)}`
              : activeSection === "actors" && relatedCharacter
                ? `Interpreta a ${getName(relatedCharacter)}`
                : item.description || "Explora los detalles de este registro."}
          </p>

          {isEpisode && (
            <span className="card-extra">
              <Clock3 size={14} />
              {formatDuration(item.duration)}
            </span>
          )}

          {isSeason && (
            <span className="card-extra">
              <CalendarDays size={14} />
              {formatDate(item.release_date)}
            </span>
          )}

          <span className="card-details">
            EXPLORAR INFORMACIÓN <ArrowUpRight size={15} />
          </span>
        </div>
      </article>
    );
  }

  const currentTitle = sections.find(
    (section) => section.id === activeSection
  )?.label;

  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="#inicio">
          <Tv size={26} />
          <span>STRANGER<span className="red">VERSE</span></span>
        </a>

        <nav className="main-nav">
          <button
            className={activeSection === "characters" ? "active" : ""}
            onClick={() => changeSection("characters")}
          >
            Personajes
          </button>

          <button
            className={activeSection === "actors" ? "active" : ""}
            onClick={() => changeSection("actors")}
          >
            Actores
          </button>

          <button
            className={activeSection === "episodes" ? "active" : ""}
            onClick={() => changeSection("episodes")}
          >
            Episodios
          </button>

          <button
            className={activeSection === "seasons" ? "active" : ""}
            onClick={() => changeSection("seasons")}
          >
            Temporadas
          </button>
        </nav>

        <a className="topbar-link" href="#explorar">
          EXPLORAR <ArrowUpRight size={15} />
        </a>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-background" />
          <div className="hero-content">
            <span className="hero-kicker">
              <span className="live-dot" />
              ARCHIVO DE HAWKINS // ACCESO AUTORIZADO
            </span>

            <h1>
              THE OTHER
              <span> SIDE.</span>
            </h1>

            <p>
              Un universo lleno de misterios, personajes,
              historias y secretos que esperan ser descubiertos.
            </p>

            <button
              className="hero-button"
              onClick={() => {
                document.getElementById("explorar")?.scrollIntoView({
                  behavior: "smooth"
                });
              }}
            >
              <Play size={17} fill="currentColor" />
              EXPLORAR UNIVERSO
            </button>

            <div className="hero-caption">
              HAWKINS, INDIANA — 1983
            </div>
          </div>

          <div className="hero-side-text">THE UPSIDE DOWN</div>
        </section>

        <section className="stats-strip">
          <div>
            <strong>{characters.length}</strong>
            <span>PERSONAJES</span>
          </div>
          <div>
            <strong>{actors.length}</strong>
            <span>ACTORES</span>
          </div>
          <div>
            <strong>{episodes.length}</strong>
            <span>EPISODIOS</span>
          </div>
          <div>
            <strong>{seasons.length}</strong>
            <span>TEMPORADAS</span>
          </div>
        </section>

        <section className="explore-section" id="explorar">
          <div className="section-heading">
            <div>
              <span className="section-kicker">BASE DE DATOS // HAWKINS</span>
              <h2>EXPLORA EL <span>UNIVERSO</span></h2>
              <p>
                Descubre quiénes forman parte de esta historia.
              </p>
            </div>

            <div className="section-counter">
              <span>ARCHIVO ACTUAL</span>
              <strong>{String(filteredItems.length).padStart(2, "0")}</strong>
            </div>
          </div>

          <div className="explore-controls">
            <div className="section-tabs">
              {sections.map((section) => {
                const Icon = section.icon;

                return (
                  <button
                    key={section.id}
                    className={
                      activeSection === section.id ? "selected" : ""
                    }
                    onClick={() => changeSection(section.id)}
                  >
                    <Icon size={17} />
                    {section.label}
                  </button>
                );
              })}
            </div>

            <div className="search-box">
              <Search size={18} />
              <input
                type="search"
                placeholder={`Buscar ${currentTitle?.toLowerCase()}...`}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              {search && (
                <button
                  aria-label="Limpiar búsqueda"
                  onClick={() => setSearch("")}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {activeSection === "episodes" && seasons.length > 0 && (
            <div className="season-filter">
              <span>FILTRAR POR TEMPORADA</span>
              <select
                value={selectedSeason}
                onChange={(event) => setSelectedSeason(event.target.value)}
              >
                <option value="all">Todas las temporadas</option>
                {seasons.map((season) => (
                  <option key={season.uuid} value={season.uuid}>
                    {season.title || `Temporada ${season.season_num}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {loading ? (
            <div className="loading-state">
              <LoaderCircle className="spinner" size={38} />
              <h3>Conectando con Hawkins...</h3>
              <p>Estamos recopilando la información del universo.</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <h3>La conexión se ha interrumpido</h3>
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>
                VOLVER A INTENTAR
              </button>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="empty-state">
              <Search size={32} />
              <h3>No encontramos resultados</h3>
              <p>Prueba con otro nombre o cambia el filtro.</p>
            </div>
          ) : (
            <div className="cards-grid">
              {filteredItems.map(renderCard)}
            </div>
          )}
        </section>

        <section className="quote-section">
          <span>THE WORLD IS FULL OF UNANSWERED QUESTIONS</span>
          <h2>
            SOME DOORS
            <br />
            SHOULD NEVER <span>BE OPENED.</span>
          </h2>
          <p>El misterio apenas comienza.</p>
        </section>
      </main>

      <footer className="footer">
        <a className="brand" href="#inicio">
          <Tv size={23} />
          <span>STRANGER<span className="red">VERSE</span></span>
        </a>

        <p>
          Un universo de misterios, personajes y dimensiones.
        </p>

        <div className="footer-bottom">
          <span>© 2026 STRANGERVERSE</span>
          <span>PROYECTO EDUCATIVO NO OFICIAL</span>
          <a
            href="https://hawapi.theproject.id/docs/"
            target="_blank"
            rel="noreferrer"
          >
            API HAWAPI <ArrowUpRight size={14} />
          </a>
        </div>
      </footer>

      {selectedItem && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedItem(null)}
        >
          <section
            className="detail-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Detalles del registro"
          >
            <button
              className="modal-close"
              onClick={() => setSelectedItem(null)}
              aria-label="Cerrar"
            >
              <X size={22} />
            </button>

            <div className="modal-image">
              <ApiImage
                item={selectedItem}
                alt={getName(selectedItem)}
              />
            </div>

            <div className="modal-info">
              <span className="section-kicker">
                ARCHIVO DE HAWKINS // DETALLES
              </span>

              <h2>{getName(selectedItem)}</h2>

              {activeSection === "characters" && (
                <>
                  <p>
                    <strong>Apodos:</strong>{" "}
                    {selectedItem.nicknames?.join(", ") || "No disponibles"}
                  </p>
                  <p>
                    <strong>Fecha de nacimiento:</strong>{" "}
                    {formatDate(selectedItem.birth_date)}
                  </p>
                  <p>
                    <strong>Fecha de fallecimiento:</strong>{" "}
                    {formatDate(selectedItem.death_date)}
                  </p>
                  <p>
                    <strong>Actor o actriz:</strong>{" "}
                    {getActorForCharacter(selectedItem)
                      ? getName(getActorForCharacter(selectedItem))
                      : "No disponible en la API"}
                  </p>
                </>
              )}

              {activeSection === "actors" && (
                <>
                  <p>
                    <strong>Nacionalidad:</strong>{" "}
                    {selectedItem.nationality || "No disponible"}
                  </p>
                  <p>
                    <strong>Fecha de nacimiento:</strong>{" "}
                    {formatDate(selectedItem.birth_date)}
                  </p>
                  <p>
                    <strong>Personaje:</strong>{" "}
                    {getCharacterForActor(selectedItem)
                      ? getName(getCharacterForActor(selectedItem))
                      : "No disponible en la API"}
                  </p>
                  <p>
                    <strong>Premios:</strong>{" "}
                    {selectedItem.awards?.join(", ") || "No disponibles"}
                  </p>
                </>
              )}

              {activeSection === "episodes" && (
                <>
                  <p>
                    <strong>Temporada:</strong>{" "}
                    {getSeasonTitle(selectedItem)}
                  </p>
                  <p>
                    <strong>Número de episodio:</strong>{" "}
                    {selectedItem.episode_num ?? "No disponible"}
                  </p>
                  <p>
                    <strong>Duración:</strong>{" "}
                    {formatDuration(selectedItem.duration)}
                  </p>
                  <p>
                    {selectedItem.description || "No hay descripción disponible."}
                  </p>
                </>
              )}

              {activeSection === "seasons" && (
                <>
                  <p>
                    <strong>Fecha de estreno:</strong>{" "}
                    {formatDate(selectedItem.release_date)}
                  </p>
                  <p>
                    <strong>Temporada:</strong>{" "}
                    {selectedItem.season_num ?? selectedItem.season ?? "No disponible"}
                  </p>
                  <p>
                    <strong>Duración total:</strong>{" "}
                    {formatDuration(selectedItem.duration_total)}
                  </p>
                  <p>
                    {selectedItem.description || "No hay descripción disponible."}
                  </p>
                </>
              )}

              {selectedItem.sources?.length > 0 && (
                <div className="modal-sources">
                  <span>FUENTES DE INFORMACIÓN</span>
                  {selectedItem.sources.slice(0, 3).map((source) => (
                    <a
                      key={source}
                      href={source}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Consultar fuente <ArrowUpRight size={14} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
