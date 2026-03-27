import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const manejarLogin = async (e) => {
    e.preventDefault();
    
    // 1. Limpieza preventiva: nos aseguramos de que no haya restos de sesiones fallidas
    await supabase.auth.signOut();
    localStorage.clear();

    // 2. Inicio de sesión real
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(), // El trim() evita errores por espacios invisibles al final
      password,
    });

    if (error) {
      alert("Error: " + error.message);
    } else if (data?.user) {
      // 3. Buscamos el rol real en la tabla 'perfiles'
      const { data: perfil, error: perfilError } = await supabase
        .from('perfiles')
        .select('rol')
        .eq('id', data.user.id)
        .single();

      // --- CAMBIO APLICADO AQUÍ ---
      if (perfilError) {
        console.error("DETALLE DEL ERROR 403:", perfilError); 
        // Forzamos limpieza total si hay un error de permisos
        localStorage.clear(); 
        alert("Error de permisos: La base de datos aún bloquea el acceso. Revisa las políticas SQL.");
        navigate('/historial'); // Redirección por defecto si algo falla
        return;
      }
      // ----------------------------

      // 4. Normalizamos y Redirigimos
      const rol = perfil?.rol?.toLowerCase();
      
      if (rol === 'admin') {
        console.log("Acceso como Administrador");
        navigate('/admin');
      } else {
        console.log("Acceso como Cliente");
        navigate('/historial');
      }
    }
  };

  return (
    <div className="contenedor-login">
      <div className="tarjeta-login">
        <h2 className="titulo-login">BIENVENIDO</h2>
        <p className="subtitulo-login">Accede a la plataforma de TallerMotors</p>
        
        <form onSubmit={manejarLogin} className="formulario-login">
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="entrada-login"
            required
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="entrada-login"
            required
          />
          <button type="submit" className="boton-login">
            INICIAR SESIÓN
          </button>
        </form>

        <div className="contenedor-enlace-secundario">
          <p className="texto-secundario">
            ¿No tienes cuenta todavía? 
            <button 
              onClick={() => navigate('/signup')} 
              className="boton-enlace"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;