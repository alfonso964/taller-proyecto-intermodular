import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'; 

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const manejarRegistro = async (e) => {
    e.preventDefault();
    
    // 1. Registro en Supabase Auth
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: window.location.origin, 
      }
    });

    if (error) {
      alert("Error en Auth: " + error.message);
    } else if (data.user) {
      // 2. Insertar en la tabla 'perfiles'
      const { error: dbError } = await supabase
        .from('perfiles')
        .insert([{ id: data.user.id, email: email }]);

      if (dbError) {
        alert("Error en Base de Datos: " + dbError.message);
      } else {
        alert("¡Cuenta creada con éxito!");
        navigate('/login');
      }
    }
  };

  return (
    <div className="contenedor-login">
      <div className="tarjeta-login">
        <h2 className="titulo-login">Crear Cuenta</h2>
        <p className="subtitulo-login">Regístrate en TallerMotors</p>
        
        <form onSubmit={manejarRegistro} className="formulario-login">
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
            Registrarse
          </button>
        </form>

        <div className="contenedor-enlace-secundario">
          <p className="texto-secundario">
            ¿Ya tienes cuenta? 
            <button 
              onClick={() => navigate('/login')} 
              className="boton-enlace"
            >
              Entra aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;