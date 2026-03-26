import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; // Importamos los estilos

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const manejarLogin = async (e) => {
    e.preventDefault();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Error: " + error.message);
    } else {
      const { data: perfil } = await supabase
        .from('perfiles')
        .select('rol')
        .eq('id', data.user.id)
        .single();

      if (perfil?.rol === 'admin') {
        navigate('/admin');
      } else {
        navigate('/historial');
      }
    }
  };

  return (
    <div className="contenedor-login">
      <div className="tarjeta-login">
        <h2 className="titulo-login">Acceso Taller</h2>
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
            ENTRAR
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;