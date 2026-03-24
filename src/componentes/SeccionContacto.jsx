import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; 
import '../styles/SeccionContacto.css'; 

const IconoEnvio = () => <span style={{ fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '8px' }}>✉️</span>;
const IconoDireccion = () => <span className="icono-contacto">📍</span>;
const IconoTelefono = () => <span className="icono-contacto">📞</span>;
const IconoReloj = () => <span className="icono-contacto">🕒</span>;
const IconoEmail = () => <span className="icono-contacto">✉️</span>;

function SeccionContacto() {
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Estado para capturar los datos del formulario comercial
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: '',
    telefono: '',
    email: '',
    interes: 'Visitar Concesionario',
    detalles_coche: ''
  });

  // Manejador de cambios en los inputs
  const handleChange = (e) => {
    setDatosFormulario({ 
      ...datosFormulario, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setCargando(true);

    try {
      // Inserción REAL en Supabase
      const { error } = await supabase
        .from('solicitudes_concesionario')
        .insert([datosFormulario]);

      if (error) throw error;

      setEnviado(true);
      // Limpiamos el formulario tras el éxito
      setDatosFormulario({ nombre: '', telefono: '', email: '', interes: 'Visitar Concesionario', detalles_coche: '' });
      
      setTimeout(() => setEnviado(false), 5000);
    } catch (error) {
      console.error("Error al enviar:", error);
      alert("Hubo un error al enviar tu solicitud. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="seccion-contacto-completa">
      {/* 1. Banner Superior */}
      <div className="banner-contacto">
        <div className="overlay-oscuro">
          <h1>Concesionario Motors</h1>
          <p>Reserva una visita a nuestra exposición o solicita información sobre vehículos en stock.</p>
        </div>
      </div>

      <div className="contenedor-principal-contacto">
        <div className="bloque-formulario">
          <h2><IconoEnvio />Envíanos un mensaje</h2>
          
          <form onSubmit={handleSubmit} className="formulario-simulado">
            <div className="fila-inputs">
              <div className="grupo-input">
                <label>Nombre completo</label>
                <input 
                  type="text" 
                  name="nombre"
                  value={datosFormulario.nombre}
                  onChange={handleChange}
                  placeholder="Ej. Juan Pérez" 
                  required 
                />
              </div>
              <div className="grupo-input">
                <label>Teléfono</label>
                <input 
                  type="tel" 
                  name="telefono"
                  value={datosFormulario.telefono}
                  onChange={handleChange}
                  placeholder="+34 999 999 999" 
                />
              </div>
            </div>
            
            <div className="grupo-input">
              <label>Correo electrónico</label>
              <input 
                type="email" 
                name="email"
                value={datosFormulario.email}
                onChange={handleChange}
                placeholder="juan@ejemplo.com" 
                required 
              />
            </div>

            <div className="grupo-input">
              <label>¿En qué estás interesado?</label>
              <select 
                name="interes" 
                value={datosFormulario.interes} 
                onChange={handleChange} 
                className="select-contacto"
              >
                <option value="Visitar Concesionario">Quiero visitar la exposición</option>
                <option value="Pedido Especial">Busco un modelo concreto (encargo)</option>
              </select>
            </div>
            
            <div className="grupo-input">
              <label>Detalles del vehículo o consulta</label>
              <textarea 
                name="detalles_coche"
                value={datosFormulario.detalles_coche}
                onChange={handleChange}
                placeholder="Cuéntanos el motivo de tu mensaje" 
                rows="6"
              ></textarea>
            </div>
            
            <button type="submit" className="boton-enviar" disabled={cargando}>
              {cargando ? "Enviando..." : "Enviar solicitud ➤"}
            </button>
            
            {enviado && (
              <p className="mensaje-enviado-suave">
                ✅ ¡Solicitud enviada con éxito! Te contactaremos pronto.
              </p>
            )}
          </form>
        </div>

    
        <div className="bloque-datos">
          <div className="grilla-datos">
            <div className="dato-item">
              <IconoDireccion />
              <div>
                <strong>Dirección</strong>
                <p>Av de Italia, 27. Montilla, Córdoba</p>
              </div>
            </div>
            
            <div className="dato-item">
              <IconoTelefono />
              <div>
                <strong>Teléfono</strong>
                <p>957 65 18 12</p>
              </div>
            </div>
            
            <div className="dato-item">
              <IconoReloj />
              <div>
                <strong>Horario</strong>
                <p>Lun-Vie: 8:30 - 14:00<br />16:00 - 19:30</p>
              </div>
            </div>
            
            <div className="dato-item">
              <IconoEmail />
              <div>
                <strong>Email</strong>
                <p>tallermotors@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="mapa-simulado">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3161.4646140502124!2d-4.636681!3d37.591244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd6d39678e000001%3A0x6436f56f1406e6!2sAv.%20de%20Italia%2C%2027%2C%2014550%20Montilla%2C%20C%C3%B3rdoba!5e0!3m2!1ses!2ses!4v1710000000000!5m2!1ses!2ses" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Taller"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeccionContacto;