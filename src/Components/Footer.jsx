
import { Tv, ExternalLink } from "lucide-react";

function Footer() {
  return (
    <footer className="footer" id="about">
      <a href="#inicio" className="logo">
        <Tv size={23} />
        <span>
          STRANGER<span className="red">VERSE</span>
        </span>
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
          <ExternalLink size={17} />
          API UTILIZADA
        </a>
      </div>
    </footer>
  );
}

export default Footer;
