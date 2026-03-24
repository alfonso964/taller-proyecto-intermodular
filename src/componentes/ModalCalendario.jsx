import Calendario from './Calendario';
import '../styles/ModalCalendario.css';

function ModalCalendario({ estaAbierto, cerrarModal, alSeleccionarFecha }) {
  if (!estaAbierto) return null;

  return (
    <div className="modal-superposicion" onClick={cerrarModal}>
      <div className="modal-contenedor" onClick={(e) => e.stopPropagation()}>
        
        <button 
          className="boton-cerrar"
          onClick={cerrarModal}
        >
          ✕
        </button>

        <h2 className="modal-titulo">
          Selecciona tu cita
        </h2>
        
        <div className="calendario-contenedor">
          <Calendario onFechaSeleccionada={alSeleccionarFecha} />
        </div>
      </div>
    </div>
  );
}

export default ModalCalendario;