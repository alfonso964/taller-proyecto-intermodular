/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa'; 
import '../styles/Login.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const navigate = useNavigate();

  const manejarLoginGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin, 
      }
    });
    if (error) alert("Error con Google: " + error.message);
  };

  const manejarLogin = async (e) => {
    e.preventDefault();
  
    await supabase.auth.signOut();
    localStorage.clear();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password:contraseña,
    });

    if (error) {
      alert("Error: " + error.message);
    } else if (data?.user) {
      const { data: perfil, error: perfilError } = await supabase
        .from('perfiles')
        .select('rol')
        .eq('id', data.user.id)
        .single();

      if (perfilError) {
        console.error("DETALLE DEL ERROR:", perfilError); 
        navigate('/'); 
        return;
      }

      const rol = perfil?.rol?.toLowerCase();
      
      if (rol === 'admin') {
        navigate('/admin');
      } else {
        navigate('/'); 
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
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            className="entrada-login"
            required
          />
          <button type="submit" className="boton-login">
            INICIAR SESIÓN
          </button>
        </form>

        <div className="divisor-login">
          <span>o continúa con</span>
        </div>

        <button 
          type="button" 
          onClick={manejarLoginGoogle} 
          className="boton-google"
        >
          <FaGoogle /> Google
        </button>

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