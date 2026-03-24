import "../styles/Servicios.css";
import { FaCogs, FaMicrochip, FaCarBattery, FaPaintBrush } from "react-icons/fa";

function Servicios() {
  const listaServicios = [
    {
      id: 1,
      icono: <FaCogs />,
      titulo: "MECÁNICA GENERAL",
      descripcion: "Revisiones preventivas, cambios de aceite, frenos y mantenimiento integral para todas las marcas."
    },
    {
      id: 2,
      icono: <FaMicrochip />,
      titulo: "ELECTRÓNICA",
      descripcion: "Diagnosis avanzada por ordenador, reparación de sistemas eléctricos y sensores de última generación."
    },
    {
      id: 3,
      icono: <FaCarBattery />,
      titulo: "NEUMÁTICOS",
      descripcion: "Venta, montaje, equilibrado y alineación de dirección. Trabajamos con las mejores marcas."
    }
  ];

  return (
    <section className="servicios-seccion" id="servicios">
      <div className="servicios-cabecera">
        <span className="servicios-etiqueta">ESPECIALIDADES</span>
        <h2>NUESTROS SERVICIOS</h2>
        <div className="subrayado"></div>
      </div>

      <div className="servicios-grid">
        {listaServicios.map((servicio) => (
          <div key={servicio.id} className="servicio-tarjeta">
            <div className="servicio-icono-contenedor">
              {servicio.icono}
            </div>
            <h3>{servicio.titulo}</h3>
            <p>{servicio.descripcion}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Servicios;