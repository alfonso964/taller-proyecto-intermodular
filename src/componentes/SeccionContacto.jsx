import React, { useState } from 'react';
import '../styles/SeccionContacto.css'; 

// Iconos simplificados
const IconoEnvio = () => <span style={{ fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '8px' }}>✉️</span>;
const IconoDireccion = () => <span className="icono-contacto">📍</span>;
const IconoTelefono = () => <span className="icono-contacto">📞</span>;
const IconoReloj = () => <span className="icono-contacto">🕒</span>;
const IconoEmail = () => <span className="icono-contacto">✉️</span>;

function SeccionContacto() {
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault(); 
    alert("¡Tu mensaje ha sido enviado (simulación)! Nos pondremos en contacto contigo pronto.");
    setEnviado(true);
    setTimeout(() => setEnviado(false), 3000);
  };

  return (
    <div className="seccion-contacto-completa">
      {/* 1. Banner Superior */}
      <div className="banner-contacto">
        <div className="overlay-oscuro">
          <h1>Contacto</h1>
          <p>Estamos listos para llevar el rendimiento de tu vehículo al siguiente nivel. Contáctanos hoy mismo.</p>
        </div>
      </div>

      {/* 2. Contenedor Principal */}
      <div className="contenedor-principal-contacto">
        
        {/* Lado Izquierdo: Formulario */}
        <div className="bloque-formulario">
          <h2><IconoEnvio />Envíanos un mensaje</h2>
          
          <form onSubmit={handleSubmit} className="formulario-simulado">
            <div className="fila-inputs">
              <div className="grupo-input">
                <label>Nombre completo</label>
                <input type="text" placeholder="Ej. Juan Pérez" />
              </div>
              <div className="grupo-input">
                <label>Teléfono</label>
                <input type="tel" placeholder="+34 000 000 000" />
              </div>
            </div>
            
            <div className="grupo-input">
              <label>Correo electrónico</label>
              <input type="email" placeholder="juan@ejemplo.com" required />
            </div>
            
            <div className="grupo-input">
              <label>Mensaje</label>
              <textarea placeholder="¿En qué podemos ayudarte?" rows="6"></textarea>
            </div>
            
            <button type="submit" className="boton-enviar">
              Enviar solicitud <span className="flecha-boton">➤</span>
            </button>
            
            {enviado && <p className="mensaje-enviado-suave">Mensaje enviado (simulación)</p>}
          </form>
        </div>

        {/* Lado Derecho: Datos y Mapa */}
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

          {/* Mapa Real con correcciones de React */}
          <div className="mapa-simulado">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3161.7634458319343!2d-4.5772326!3d37.5841452!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd6d391307b27877%3A0x62963660e56e01a4!2sAv.%20de%20Italia%2C%2027%2C%2014550%20Montilla%2C%20C%C3%B3rdoba!5e0!3m2!1ses!2ses!4v1710000000000!5m2!1ses!2ses" 
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