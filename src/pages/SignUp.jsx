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
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert("Error: " + error.message);
    } else if (data.user) {
      // 2. Insertar en la tabla 'perfiles' que limpiamos con SQL
      await supabase.from('perfiles').insert([{ id: data.user.id, email: email }]);
      alert("¡Cuenta creada! Ya puedes iniciar sesión.");
      navigate('/login');
    }
  };

  return (
    <div className="contenedor-login">
      <div className="tarjeta-login">
        <h2 className="titulo-login">Crear Cuenta</h2>
        <p className="subtitulo-login">Regístrate en TallerMotors</p>
        <form onSubmit={manejarRegistro} className="formulario-login">
          <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} className="entrada-login" required />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className="entrada-login" required />
          <button type="submit" className="boton-login">Registrarse</button>
        </form>
        <button onClick={() => navigate('/login')} className="boton-enlace">¿Ya tienes cuenta? Entra aquí</button>
      </div>
    </div>
  );
};

export default SignUp;