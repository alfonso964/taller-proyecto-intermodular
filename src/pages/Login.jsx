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
    
    // 1. Inicio de sesión oficial con Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Error: " + error.message);
    } else {
      // 2. Buscamos el rol en la tabla 'perfiles'
      const { data: perfil } = await supabase
        .from('perfiles')
        .select('rol')
        .eq('id', data.user.id)
        .single();

      // 3. Normalizamos el rol
      const rolNormalizado = perfil?.rol?.toLowerCase();

      // 4. Redirección inteligente
      if (rolNormalizado === 'admin') {
        console.log("Acceso concedido al Panel de Admin");
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
        <h2 className="titulo-login">Bienvenido</h2>
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
            Iniciar Sesión
          </button>
        </form>

        {/* --- Sección de navegación corregida con clases CSS --- */}
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