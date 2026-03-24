import React, { useState } from 'react';
import '../styles/SeccionContacto.css'; // Asegúrate de crear este archivo de estilos

// Iconos (he usado emojis o texto simulado para que no necesites dependencias,
// pero si usas FontAwesome o HeroIcons, puedes cambiarlos).
const IconoEnvio = () => <span style={{ fontSize: '1.2rem', verticalAlign: 'middle', marginRight: '8px' }}>✉️</span>;
const IconoDireccion = () => <span className="icono-contacto">📍</span>;
const IconoTelefono = () => <span className="icono-contacto">📞</span>;
const IconoReloj = () => <span className="icono-contacto">🕒</span>;
const IconoEmail = () => <span className="icono-contacto">✉️</span>;

function SeccionContacto() {
  // Estado para simular el envío
  const [enviado, setEnviado] = useState(false);

  // Función simulada de envío
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    
    // Aquí podrías añadir lógica para limpiar los inputs si quisieras
    
    // Mostramos el mensaje de simulación
    alert("¡Tu mensaje ha sido enviado (simulación)! Nos pondremos en contacto contigo pronto.");
    setEnviado(true);
    
    // Opcional: resetear el estado después de unos segundos
    setTimeout(() => setEnviado(false), 3000);
  };

  return (
    <div className="seccion-contacto-completa">
      {/* 1. Banner Superior con Fondo */}
      <div className="banner-contacto">
        <div className="overlay-oscuro">
          <h1>Contacto</h1>
          <p>Estamos listos para llevar el rendimiento de tu vehículo al siguiente nivel. Contáctanos hoy mismo.</p>
        </div>
      </div>

      {/* 2. Contenedor Principal (Formulario + Datos) */}
      <div className="contenedor-principal-contacto">
        
        {/* Lado Izquierdo: Formulario Simulado */}
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
            
            <div className="grupo-input full-width">
              <label>Correo electrónico</label>
              <input type="email" placeholder="juan@ejemplo.com" required />
            </div>
            
            <div className="grupo-input full-width">
              <label>Mensaje</label>
              <textarea placeholder="¿En qué podemos ayudarte?" rows="6"></textarea>
            </div>
            
            <button type="submit" className="boton-enviar">
              Enviar solicitud <span className="flecha-boton">➤</span>
            </button>
            
            {enviado && <p className="mensaje-enviado-suave">Mensaje enviado (simulación)</p>}
          </form>
        </div>

        {/* Lado Derecho: Datos de Contacto y Mapa Simulado */}
        <div className="bloque-datos">
          
          <div className="grilla-datos">
            <div className="dato-item">
              <IconoDireccion />
              <div>
                <strong>Dirección</strong>
                <p>Polígono Industrial Norte, Calle Motor 24, Madrid, España</p>
              </div>
            </div>
            
            <div className="dato-item">
              <IconoTelefono />
              <div>
                <strong>Teléfono</strong>
                <p>+34 912 345 678</p>
              </div>
            </div>
            
            <div className="dato-item">
              <IconoReloj />
              <div>
                <strong>Horario</strong>
                <p>Lun-Vie: 08:30-19:00<br />Sáb: 09:00-13:00</p>
              </div>
            </div>
            
            <div className="dato-item">
              <IconoEmail />
              <div>
                <strong>Email</strong>
                <p>taller@autoelite.com</p>
              </div>
            </div>
          </div>

          {/* Mapa Simulado (Es solo un div gris para la presentación) */}
          <div className="mapa-simulado">
            <span>[ Mapa Simulado ]</span>
            {/* Si quisieras un mapa real de Google, aquí pondrías el <iframe> */}
          </div>

        </div>
      </div>
    </div>
  );
}

export default SeccionContacto;