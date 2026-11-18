
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

function CharacterCard({ character, onSelect }) {
  const images = [
    character.thumbnail,
    ...(Array.isArray(character.images) ? character.images : [])
  ].filter((image) => typeof image === "string" && image.trim() !== "");

  const [imageIndex, setImageIndex] = useState(0);

  const name = [
    character.first_name,
    character.last_name
  ].filter(Boolean).join(" ") || "Personaje desconocido";

  const image = images[imageIndex];

  return (
    <article
      className="character-card"
      onClick={() => onSelect(character)}
      onKeyDown={(event) => {
        if (event.key === "Enter") onSelect(character);
      }}
      role="button"
      tabIndex={0}
    >
      <div className="character-image">
        {image ? (
          <img
            src={image}
            alt={`Fotografía de ${name}`}
            loading="lazy"
            onError={() => setImageIndex((current) => current + 1)}
          />
        ) : (
          <div className="image-placeholder">
            <span>IMAGEN NO DISPONIBLE</span>
          </div>
        )}

        <div className="image-number">
          {character.uuid?.slice(0, 4) || "0000"}
        </div>

        <div className="card-overlay"></div>

        <div className="card-info">
          <span className="card-label">HAWKINS RESIDENT</span>

          <h3>{name}</h3>

          <span className="card-link">
            VER INFORMACIÓN <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
    </article>
  );
}

export default CharacterCard;
