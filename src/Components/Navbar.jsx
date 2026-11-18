
import { Tv, Menu } from "lucide-react";

function Navbar() {
  return (
    <nav className="navbar">
      <a href="#inicio" className="logo">
        <Tv size={25} />
        <span>STRANGER<span className="red">VERSE</span></span>
      </a>

      <div className="nav-links">
        <a href="#inicio">Inicio</a>
        <a href="#characters">Personajes</a>
        <a href="#about">Universo</a>
      </div>

      <a href="#characters" className="nav-button">
        Explorar <span>↗</span>
      </a>

      <a href="#characters" className="mobile-menu" aria-label="Ir a personajes">
        <Menu size={25} />
      </a>
    </nav>
  );
}

export default Navbar;
