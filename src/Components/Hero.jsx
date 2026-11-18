
import { ArrowDown, Sparkles } from "lucide-react";

function Hero() {
  return (
    <header className="hero" id="inicio">
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <div className="hero-tag">
          <Sparkles size={15} />
          <span>EL UNIVERSO DE HAWKINS</span>
        </div>

        <p className="hero-small">UN MUNDO EXTRAORDINARIO</p>

        <h1>
          STRANGER
          <span>VERSE</span>
        </h1>

        <div className="hero-line"></div>

        <p className="hero-description">
          Explora los personajes, descubre sus historias
          y adéntrate en los misterios de Hawkins.
        </p>

        <a href="#characters" className="hero-button">
          DESCUBRIR PERSONAJES
          <ArrowDown size={18} />
        </a>

        <div className="hero-bottom-text">
          <span>HAWKINS, INDIANA</span>
          <span>1983 — EL COMIENZO</span>
        </div>
      </div>

      <div className="hero-decoration">011</div>
    </header>
  );
}

export default Hero;
