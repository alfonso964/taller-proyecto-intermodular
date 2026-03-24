import { NavLink } from "react-router-dom";
import { FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp, FaDirections } from 'react-icons/fa';
import "../styles/Footer.css";

function Footer() {
  const manejarClick = (e) => e.preventDefault();

  // URL directa a Google Maps para Taller Motors
  const googleMapsUrl = "https://www.google.com/maps/dir/?api=1&destination=Av.+de+Italia,+27,+14550+Montilla,+Córdoba";

  return (
    <footer className="footer-principal">
      <div className="footer-contenedor">
        
        <div className="footer-marca">
          <h2 className="footer-logo">TALLER <span> MOTORS</span></h2>
          <p>Líderes en el mantenimiento y diagnóstico avanzado. Innovación y confianza en cada reparación.</p>
          <div className="footer-contacto-simple">
             <p><FaMapMarkerAlt /> Av de Italia, 27. Montilla, Córdoba</p>
             <p><FaPhoneAlt /> 957 65 18 12</p>
          </div>
          <div className="footer-redes-iconos">
            <a href="#" onClick={manejarClick} aria-label="Instagram"><FaInstagram /></a>
            <a href="#" onClick={manejarClick} aria-label="Facebook"><FaFacebook /></a>
            <a href="#" onClick={manejarClick} aria-label="Whatsapp"><FaWhatsapp /></a>
          </div>
        </div>

        {/* Enlaces y Horario */}
        <div className="footer-enlaces">
          <h4>Navegación</h4>
          <ul>
            <li><NavLink to="/">Inicio</NavLink></li>
            <li><NavLink to="/servicios">Servicios</NavLink></li>
            <li><NavLink to="/contacto">Contacto</NavLink></li>
            <li><NavLink to="/reserva-ia">Diagnóstico IA</NavLink></li>
          </ul>
          
          <div className="footer-horario">
            <h4>Horario</h4>
            <p>Lun - Vie: 8:30 - 14:00</p>
            <p>Tardes: 16:00 - 19:30</p>
          </div>
        </div>

        {/* Mapa con Iframe y Botón de Acción */}
        <div className="footer-ubicacion">
          <h4>Ubicación</h4>
          <div className="mapa-simulado-footer">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3161.474643194511!2d-4.639892623455!3d37.579475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd6d17e3f8b0e8e7%3A0x6b1f2e3f8b0e8e7!2sAv.%20de%20Italia%2C%2027%2C%2014550%20Montilla%2C%20C%C3%B3rdoba!5e0!3m2!1ses!2ses!4v1711310000000!5m2!1ses!2ses" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Taller Motors"
            ></iframe>
          </div>
          <a 
            href={googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-como-llegar"
          >
            <FaDirections /> CÓMO LLEGAR
          </a>
        </div>

      </div>
      
      <div className="footer-inferior">
        <p>© {new Date().getFullYear()} Taller Motors. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;