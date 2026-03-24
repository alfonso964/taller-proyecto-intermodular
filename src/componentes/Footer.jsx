import { NavLink } from "react-router-dom";
import { FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import "../styles/Footer.css";

function Footer() {
  const manejarClick = (e) => e.preventDefault();

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

        {/* Mapa con Iframe de Google */}
        <div className="footer-ubicacion">
          <h4>Ubicación</h4>
          <div className="mapa-simulado-footer">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3161.427387405232!2d-4.639892623467616!3d37.58007497203417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd6d39695d732891%3A0x7d07943477103e65!2sAv.%20de%20Italia%2C%2027%2C%2014550%20Montilla%2C%20C%C3%B3rdoba!5e0!3m2!1ses!2ses!4v1711310000000!5m2!1ses!2ses" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Taller Motors"
            ></iframe>
          </div>
        </div>

      </div>
      
      <div className="footer-inferior">
        <p>© {new Date().getFullYear()} Taller Motors. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;