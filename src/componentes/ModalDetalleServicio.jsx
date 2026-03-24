/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5'; // Icono mucho más limpio
import '../styles/ModalServicio.css';

function ModalDetalleServicio({ servicio, cerrar }) {
  if (!servicio) return null;

  return (
    <AnimatePresence>
      <div className="modal-servicio-overlay" onClick={cerrar}>
        <motion.div 
          className="modal-servicio-card"
          initial={{ opacity: 0, y: 70, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 70, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* BOTÓN DE CIERRE CON ICONO */}
          <button className="modal-servicio-cerrar" onClick={cerrar} aria-label="Cerrar">
            <IoClose />
          </button>
          
          <div className="modal-servicio-header">
            <h2>{servicio.titulo}</h2>
          </div>

          <div className="modal-servicio-body">
            <h4>Incluye:</h4>
            <ul className="modal-servicio-lista">
              {servicio.puntos.map((item, index) => (
                <li key={index}><span>✓</span> {item}</li>
              ))}
            </ul>

            <div className="modal-servicio-meta">
              <div className="meta-item">
                <strong>Tiempo aprox: </strong>
                <span>{servicio.tiempo}</span>
              </div>
              <div className="meta-item">
                <strong> Precio: </strong>
                <span>{servicio.precio}</span>
              </div>
            </div>

            <p className="modal-servicio-nota">{servicio.nota}</p>
          </div>

          <button className="modal-servicio-btn-ok" onClick={cerrar}>
            Entendido
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ModalDetalleServicio;