/* --- src/components/Navbar.jsx --- */
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
    const obtenerSesionInicial = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      actualizarEstadoUsuario(session);
    };
    obtenerSesionInicial();

    const actualizarEstadoUsuario = async (session) => {
      setUsuario(session?.user || null);
      if (session?.user) {
        const { data } = await supabase
          .from('perfiles')
          .select('rol')
          .eq('id', session.user.id)
          .single();
        setRol(data?.rol?.toLowerCase() || 'user'); 
      } else {
        setRol(null);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      actualizarEstadoUsuario(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const cerrarSesion = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUsuario(null);
      setRol(null);
      setEstaAbierto(false);
      
      console.log("Sesión cerrada con éxito");
      navigate('/');
    } catch (error) {
      alert("Error al cerrar sesión: " + error.message);
    }
  };

  const cerrarMenu = () => setEstaAbierto(false);
  
  const toggleMenu = () => setEstaAbierto(!estaAbierto);

  return (
    <header className="navegacion-cabecera">
      <div className="navegacion-contenedor">
        <div className="nav-logo">
          <NavLink to="/" className="enlace-logo" onClick={cerrarMenu}>
            <img src="/logoTaller.png" alt="Logo" className="logo-imagen" />
            <span className="navegacion-titulo">Taller<span className="texto-acento">Motors</span></span>
          </NavLink>
        </div>

        <button className="boton-menu" onClick={toggleMenu} aria-label="Menu">
          <div className={`hamburguesa ${estaAbierto ? "abierto" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        <nav className={`enlaces-lista ${estaAbierto ? "abierto" : ""}`}>
          <NavLink to="/" className="enlace-item" onClick={cerrarMenu}>Inicio</NavLink>
          <NavLink to="/servicios" className="enlace-item" onClick={cerrarMenu}>Servicios</NavLink>
          <NavLink to="/contacto" className="enlace-item" onClick={cerrarMenu}>Contacto</NavLink>
          
          {usuario ? (
            <>
              {rol === 'admin' ? (
                <NavLink to="/admin" className="enlace-item" onClick={cerrarMenu}>Panel Admin</NavLink>
              ) : (
                /* RUTA CORREGIDA AQUÍ */
                <NavLink to="/mis-reparaciones" className="enlace-item" onClick={cerrarMenu}>
                  Mis Reparaciones
                </NavLink>
              )}
              <button onClick={cerrarSesion} className="enlace-item btn-logout-limpio">
                Salir
              </button>
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