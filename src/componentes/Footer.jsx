import { NavLink } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { FaFacebook, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import "../styles/Footer.css";

const iconAuto = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

function Footer() {
  const posicion = [37.580075, -4.637704];

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
            <a href="#" onClick={manejarClick}><FaInstagram /></a>
            <a href="#" onClick={manejarClick}><FaFacebook /></a>
            <a href="#" onClick={manejarClick}><FaWhatsapp /></a>
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

        {/* Mapa */}
        <div className="footer-ubicacion">
          <h4>Ubicación</h4>
          <div className="footer-mapa-wrapper">
            <MapContainer center={posicion} zoom={15} scrollWheelZoom={false} style={{ height: "180px", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={posicion} icon={iconAuto} />
            </MapContainer>
          </div>
        </div>

      </div>
      
      <div className="footer-inferior">
        <p>&copy; {new Date().getFullYear()} Taller Motors. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;