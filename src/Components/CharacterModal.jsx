
import { useState } from "react";
import { X, Calendar, UserRound } from "lucide-react";

function CharacterModal({ character, onClose }) {
  const [imageIndex, setImageIndex] = useState(0);

  if (!character) return null;

  const images = [
    character.thumbnail,
    ...(Array.isArray(character.images) ? character.images : [])
  ].filter((image) => typeof image === "string" && image.trim() !== "");

  const name = [
    character.first_name,
    character.last_name
  ].filter(Boolean).join(" ") || "Personaje desconocido";

  const image = images[imageIndex];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="character-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Información de ${name}`}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Cerrar ventana"
        >
          <X size={24} />
        </button>

        <div className="modal-image">
          {image ? (
            <img
              src={image}
              alt={name}
              onError={() => setImageIndex((current) => current + 1)}
            />
          ) : (
            <div className="image-placeholder">
              IMAGEN NO DISPONIBLE
            </div>
          )}
        </div>

        <div className="modal-content">
          <span className="card-label">ARCHIVO DE HAWKINS</span>

          <h2>{name}</h2>

          <div className="modal-detail">
            <UserRound size={18} />
            <div>
              <small>APODOS</small>
              <p>
                {character.nicknames?.length
                  ? character.nicknames.join(", ")
                  : "No disponible"}
              </p>
            </div>
          </div>

          <div className="modal-detail">
            <Calendar size={18} />
            <div>
              <small>FECHA DE NACIMIENTO</small>
              <p>{character.birth_date || "No disponible"}</p>
            </div>
          </div>

          <div className="modal-detail">
            <Calendar size={18} />
            <div>
              <small>FECHA DE FALLECIMIENTO</small>
              <p>{character.death_date || "No registrada"}</p>
            </div>
          </div>

          <p className="modal-description">
            Explora los datos disponibles de este personaje
            dentro del universo de Stranger Things.
          </p>

          <button className="modal-button" onClick={onClose}>
            CERRAR ARCHIVO
          </button>
        </div>
      </section>
    </div>
  );
}

export default CharacterModal;
