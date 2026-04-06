import { useState } from 'react'; 
import Footer from "../componentes/Footer";
import ModalDetalleServicio from "../componentes/ModalDetalleServicio"; 
import { detallesServicios } from "../data/serviciosDetalles"; 
import "../styles/PaginaServicios.css";
import { Link } from "react-router-dom";
import { FaGears, FaMicrochip, FaCarSide, FaTemperatureArrowDown, FaClipboardCheck, FaCircleDot, FaShieldHalved, FaClockRotateLeft, FaMedal} from "react-icons/fa6";

function PaginaServicios() {
  
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);

  const listaServicios = [
    { id: 1, titulo: "Mecánica General", descripcion: "Mantenimiento preventivo, cambios de aceite, filtros y reparaciones complejas de motores.", imagen: "/mecanicaGeneral.jpg", icono: <FaGears /> },
    { id: 2, titulo: "Electrónica", descripcion: "Diagnóstico computarizado avanzado para detectar fallos eléctricos y sistemas de inyección.", imagen: "/electronica.jpg", icono: <FaMicrochip /> },
    { id: 3, titulo: "Neumáticos", descripcion: "Venta, montaje, alineación y equilibrado. Trabajamos con las mejores marcas del mercado.", imagen: "/neumaticos.webp", icono: <FaCircleDot /> },
    { id: 4, titulo: "Chapa y Pintura", descripcion: "Reparación de carrocería con acabados profesionales. Trabajamos con todas las aseguradoras.", imagen: "/chapa.jpg", icono: <FaCarSide /> },
    { id: 5, titulo: "Aire Acondicionado", descripcion: "Carga de gas refrigerante, detección de fugas y desinfección integral del sistema.", imagen: "/aireAcondicionado.jpg", icono: <FaTemperatureArrowDown /> },
    { id: 6, titulo: "Pre-ITV", descripcion: "Revisión de seguridad completa y emisiones para garantizar que superes la inspección.", imagen: "/preITV.jpg", icono: <FaClipboardCheck /> }
  ];

  return (
    <div className="servicios-page">
      <div className="servicios-contenido-wrapper">
        <header className="servicios-header">
          <h1>Nuestros Servicios Especializados</h1>
          <p>En <strong>Taller Motors</strong> combinamos tecnología de última generación con la experiencia de técnicos certificados.</p>
        </header>

        <div className="servicios-grid">
          {listaServicios.map((servicio) => (
            <div key={servicio.id} className="servicio-card">
              <div className="servicio-imagen">
                <img src={servicio.imagen} alt={servicio.titulo} />
              </div>
              <div className="servicio-contenido">
                <div className="servicio-icono">{servicio.icono}</div>
                <h3>{servicio.titulo}</h3>
                <p>{servicio.descripcion}</p>
                <button 
                  className="btn-saber-mas"
                  onClick={() => setServicioSeleccionado(detallesServicios[servicio.id])}
                >
                  Saber más →
                </button>
              </div>
            </div>
          ))}
        </div>

        <section className="servicios-cta-ia">
          <div className="cta-ia-card">
            <h2>¿Tu coche hace un ruido extraño?</h2>
            <p>No esperes más. Prueba nuestro sistema de diagnóstico inteligente y sal de dudas en menos de un minuto.</p>
            <Link to="/reserva-ia" className="btn-ir-ia">
              Consultar con nuestra IA
            </Link>
          </div>
        </section>

        <section className="servicios-garantias-container">
          <div className="garantia-card">
            <FaShieldHalved className="garantia-icon" />
            <h4>Garantía Total</h4>
            <p>12 meses en todas las piezas y mano de obra para tu tranquilidad.</p>
          </div>
          <div className="garantia-card">
            <FaClockRotateLeft className="garantia-icon" />
            <h4>Servicio Rápido</h4>
            <p>Optimizamos procesos para que recuperes tu vehículo en tiempo récord.</p>
          </div>
          <div className="garantia-card">
            <FaMedal className="garantia-icon" />
            <h4>Calidad Premium</h4>
            <p>Solo utilizamos recambios originales y materiales de alta gama.</p>
          </div>
        </section>
      </div>
      
      <ModalDetalleServicio 
        servicio={servicioSeleccionado} 
        cerrar={() => setServicioSeleccionado(null)} 
      />

      <Footer/>
    </div>
  );
}

export default PaginaServicios;