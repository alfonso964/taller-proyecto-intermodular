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
        setRol(data?.rol?.toLowerCase() || 'user'); // Forzamos minúsculas
      } else {
        setRol(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    setEstaAbierto(false);
    navigate('/');
  };

  return (
    <header className="navegacion-cabecera">
      <div className="navegacion-contenedor">
        <div className="nav-logo">
          <NavLink to="/" className="enlace-logo">
            <img src="/logoTaller.png" alt="Logo" className="logo-imagen" />
            <span className="navegacion-titulo">Taller<span className="texto-acento">Motors</span></span>
          </NavLink>
        </div>

        <nav className={`enlaces-lista ${estaAbierto ? "abierto" : ""}`}>
          <NavLink to="/" className="enlace-item">Inicio</NavLink>
          
          {usuario ? (
            <>
              {/* Aquí está la clave: si el rol es admin, muestra Panel */}
              {rol === 'admin' ? (
                <NavLink to="/admin" className="enlace-item">Panel Admin</NavLink>
              ) : (
                <NavLink to="/historial" className="enlace-item">Mis Reparaciones</NavLink>
              )}
              <button onClick={cerrarSesion} className="enlace-item btn-logout-limpio">
                Salir
              </button>
            </>
          ) : (
            <NavLink to="/login" className="enlace-item">Acceso</NavLink>
          )}

          <NavLink to="/reserva-ia" className="boton-reserva">Diagnóstico y Cita</NavLink>
        </nav>
      </div>
    </header>
  );
}
export default Navbar;