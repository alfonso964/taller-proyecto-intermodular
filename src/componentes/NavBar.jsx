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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUsuario(session?.user || null);
      if (session?.user) {
        const { data } = await supabase
          .from('perfiles')
          .select('rol')
          .eq('id', session.user.id)
          .single();
        
        // Normalizamos el rol a minúsculas según nuestra nueva regla de base de datos
        setRol(data?.rol?.toLowerCase() || 'user'); 
      } else {
        setRol(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const cerrarSesion = async () => {
    // 1. Ejecuta el cierre de sesión en Supabase
    await supabase.auth.signOut();
    // 2. Cierra el menú móvil
    setEstaAbierto(false);
    // 3. Redirige al inicio
    navigate('/');
  };

  const cerrarMenu = () => setEstaAbierto(false);

  return (
    <header className="navegacion-cabecera">
      <div className="navegacion-contenedor">
        <div className="nav-logo">
          <NavLink to="/" className="enlace-logo" onClick={cerrarMenu}>
            <img src="/logoTaller.png" alt="Logo" className="logo-imagen" />
            <span className="navegacion-titulo">Taller<span className="texto-acento">Motors</span></span>
          </NavLink>
        </div>

        <nav className={`enlaces-lista ${estaAbierto ? "abierto" : ""}`}>
          {/* ENLACES PÚBLICOS */}
          <NavLink to="/" className="enlace-item" onClick={cerrarMenu}>Inicio</NavLink>
          <NavLink to="/servicios" className="enlace-item" onClick={cerrarMenu}>Servicios</NavLink>
          <NavLink to="/contacto" className="enlace-item" onClick={cerrarMenu}>Contacto</NavLink>
          
          {/* ENLACES PRIVADOS SEGÚN ROL */}
          {usuario ? (
            <>
              {rol === 'admin' ? (
                <NavLink to="/admin" className="enlace-item" onClick={cerrarMenu}>Panel Admin</NavLink>
              ) : (
                <NavLink to="/historial" className="enlace-item" onClick={cerrarMenu}>Mis Reparaciones</NavLink>
              )}
              {/* Este botón ahora tiene la clase para quitarle el estilo de 'botón gris' */}
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