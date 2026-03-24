import { useNavigate } from "react-router-dom";
import "../styles/Hero.css";

function Hero() {
  const navegar = useNavigate();

  const manejarNavegacion = (ruta) => {
    navegar(ruta);
  };

  return (
    <section className="hero-principal" id="inicio">
      <div className="hero-capa-oscura"></div>
      
      <div className="hero-contenido">
        <h1>CUIDAMOS TU COCHE <span className="titulo-pequeño">COMO SI FUERA NUESTRO</span></h1>
        
        <p>
          En Taller Motors combinamos la mecánica tradicional con diagnóstico 
          por IA para ofrecerte el cuidado que tu coche merece.
        </p>
        
        <div className="hero-botones">
          <button 
            className="boton-principal" 
            onClick={() => manejarNavegacion("/reserva-ia")}
          >
            Pedir Cita Online
          </button>
          
          <button 
            className="boton-secundario" 
            onClick={() => manejarNavegacion("/servicios")}
          >
            Explorar Servicios
          </button>
        </div>

        <div className="hero-estadisticas">
          <div className="estadistica-item">
            <span className="estadistica-numero">+15</span>
            <span className="estadistica-texto">Años de Experiencia</span>
          </div>
          <div className="estadistica-item">
            <span className="estadistica-numero">100%</span>
            <span className="estadistica-texto">Garantía Certificada</span>
          </div>
          <div className="estadistica-item">
            <span className="estadistica-numero">IA</span>
            <span className="estadistica-texto">Diagnóstico Avanzado</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;