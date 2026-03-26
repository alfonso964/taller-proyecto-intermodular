/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/NavBar.css"; 

function Navbar() {
  const [estaAbierto, setEstaAbierto] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Escuchar cambios en la sesión (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUsuario(session?.user || null);
      if (session?.user) {
        obtenerRol(session.user.id);
      } else {
        setRol(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const obtenerRol = async (userId) => {
    const { data } = await supabase
      .from('perfiles')
      .select('rol')
      .eq('id', userId)
      .single();
    
    // Normalizamos el rol a minúsculas para que coincida siempre
    if (data?.rol) {
      setRol(data.rol.toLowerCase());
    }
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    setEstaAbierto(false);
    navigate('/');
  };

  const cambiarMenu = () => setEstaAbierto(!estaAbierto);
  const cerrarMenu = () => setEstaAbierto(false);

  return (
    <header className="navegacion-cabecera">
      <div className="navegacion-contenedor">
        
        {/* LOGO */}
        <div className="nav-logo">
          <NavLink to="/" className="enlace-logo" onClick={cerrarMenu}>
            <img src="/logoTaller.png" alt="Logo Taller" className="logo-imagen" />
            <span className="navegacion-titulo">
              Taller<span className="texto-acento">Motors</span>
            </span>
          </NavLink>
        </div>

        {/* BOTÓN HAMBURGUESA */}
        <button className="boton-menu" onClick={cambiarMenu} aria-label="Menu">
          <div className={`hamburguesa ${estaAbierto ? "abierto" : ""}`}>
            <span></span><span></span><span></span>
          </div>
        </button>

        {/* ENLACES */}
        <nav className={`enlaces-lista ${estaAbierto ? "abierto" : ""}`}>
          <NavLink to="/" className="enlace-item" onClick={cerrarMenu}>Inicio</NavLink>
          <NavLink to="/servicios" className="enlace-item" onClick={cerrarMenu}>Servicios</NavLink>
          
          {/* Enlaces condicionales con lógica de rol protegida */}
          {usuario ? (
            <>
              {rol === 'admin' ? (
                <NavLink to="/admin" className="enlace-item" onClick={cerrarMenu}>Panel Admin</NavLink>
              ) : (
                <NavLink to="/historial" className="enlace-item" onClick={cerrarMenu}>Mis Reparaciones</NavLink>
              )}
              <button onClick={cerrarSesion} className="boton-salir">Salir</button>
            </>
          ) : (
            <NavLink to="/login" className="enlace-item" onClick={cerrarMenu}>Acceso</NavLink>
          )}

          <NavLink to="/reserva-ia" className="boton-reserva" onClick={cerrarMenu}>
            Diagnóstico y Cita
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;