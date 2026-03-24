/* eslint-disable no-unused-vars */
import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/NavBar.css"; 

function Navbar() {
  const [estaAbierto, setEstaAbierto] = useState(false); 

  const cambiarMenu = () => setEstaAbierto(!estaAbierto);
  const cerrarMenu = () => setEstaAbierto(false);

  return (
    <header className="navegacion-cabecera">
      <div className="navegacion-contenedor">
        
        {/* LOGO */}
        <div className="nav-logo">
          <NavLink to="/" className="enlace-logo" onClick={cerrarMenu}>
            <img 
              src="/logoTaller.png" 
              alt="Logo Taller" 
              className="logo-imagen"
            />
            <span className="navegacion-titulo">
              Taller<span className="texto-acento">Motors</span>
            </span>
          </NavLink>
        </div>

        {/* BOTÓN HAMBURGUESA (Solo visible en móvil) */}
        <button className="boton-menu" onClick={cambiarMenu} aria-label="Menu">
          <div className={`hamburguesa ${estaAbierto ? "abierto" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        {/* ENLACES (Se adaptan con CSS) */}
        <nav className={`enlaces-lista ${estaAbierto ? "abierto" : ""}`}>
          <NavLink to="/" className="enlace-item" onClick={cerrarMenu}>Inicio</NavLink>
          <NavLink to="/servicios" className="enlace-item" onClick={cerrarMenu}>Servicios</NavLink>
          <NavLink to="/contacto" className="enlace-item" onClick={cerrarMenu}>Contacto</NavLink>
          <NavLink to="/reserva-ia" className="boton-reserva" onClick={cerrarMenu}>
            Diagnóstico y Cita
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;