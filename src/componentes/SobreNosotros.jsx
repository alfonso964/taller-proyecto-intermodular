import "../styles/SobreNosotros.css";
import { FaCheckCircle } from "react-icons/fa";

function SobreNosotros() {
  return (
    <section className="sobre-nosotros" id="nosotros">
      <div className="container-nosotros">
        
        <div className="nosotros-imagen">
          <img 
            src="/imagenTaller.jpeg" 
            alt="Instalaciones Taller Motors" 
          />
          <div className="experiencia-badge">
            <span>+15</span>
            <p>Años de Experiencia</p>
          </div>
        </div>

        <div className="nosotros-texto">
          <span className="etiqueta-superior">CONÓCENOS</span>
          <h2>Pasión por la mecánica, <span>impulsada por la tecnología</span></h2>
          <p>
            En <strong className="nombre-empresa">Taller Motors</strong>, no solo reparamos vehículos; cuidamos de tu 
            seguridad y tranquilidad. Nacimos con la visión de transformar el concepto de 
            taller tradicional en un centro de alto rendimiento.
          </p>
          <p>
            Combinamos décadas de experiencia en mecánica de precisión con las herramientas 
            de <strong>Inteligencia Artificial</strong> más avanzadas del mercado para ofrecerte 
            un diagnóstico exacto y transparente.
          </p>

          <ul className="nosotros-puntos">
            <li><FaCheckCircle className="icono-check" /> Transparencia total en cada presupuesto.</li>
            <li><FaCheckCircle className="icono-check" /> Equipo técnico en formación continua.</li>
            <li><FaCheckCircle className="icono-check" /> Garantía certificada en todas las piezas.</li>
          </ul>

        </div>

      </div>
    </section>
  );
}

export default SobreNosotros;