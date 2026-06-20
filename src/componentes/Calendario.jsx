/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { es } from 'date-fns/locale';
import axios from 'axios';
import 'react-day-picker/dist/style.css'; 
import '../styles/Calendario.css';

function Calendario({ onFechaSeleccionada }) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [citasOcupadas, setCitasOcupadas] = useState([]);
  const [horasDisponibles, setHorasDisponibles] = useState([]);

  // 1. Cargar las citas desde tu API en Render
  useEffect(() => {
    const cargarCitas = async () => {
      try {
        const res = await axios.get('https://taller-proyecto-intermodular.onrender.com/api/citas');
        setCitasOcupadas(res.data);
      } catch (err) {
        console.error("Error al cargar citas:", err);
      }
    };
    cargarCitas();
  }, []);

  // 2. Generar tramos horarios de 30 min basados en tu horario real del taller
  useEffect(() => {
    if (!fechaSeleccionada) return;

    const horasDia = [];
    const generarTramos = (horaInicio, horaFin) => {
      let actual = horaInicio * 60; 
      const fin = horaFin * 60;
      while (actual < fin) {
        const h = Math.floor(actual / 60);
        const m = actual % 60;
        horasDia.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
        actual += 30; 
      }
    };

    generarTramos(8.5, 14);
    generarTramos(16, 19.5);

    const listadoFinal = horasDia.map(horaStr => {
      const [h, m] = horaStr.split(':').map(Number);
      
      const fechaTramo = new Date(fechaSeleccionada);
      fechaTramo.setHours(h, m, 0, 0);

      const estaOcupado = citasOcupadas.some(cita => {
        const inicioCita = new Date(cita.fecha);
        const duracion = cita.duracionEstimada || 60;
        const finCita = new Date(inicioCita.getTime() + duracion * 60000);
        return fechaTramo >= inicioCita && fechaTramo < finCita;
      });

      const esPasado = fechaTramo < new Date();

      return {
        hora: horaStr,
        objetoFecha: fechaTramo,
        disponible: !estaOcupado && !esPasado
      };
    });

    setHorasDisponibles(listadoFinal);
  }, [fechaSeleccionada, citasOcupadas]);

  const handleHoraClick = (tramo) => {
    if (!tramo.disponible) return;

    const fechaLegible = tramo.objetoFecha.toLocaleString('es-ES', { 
      weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' 
    });
    
    if (window.confirm(`¿Confirmas la reserva para el ${fechaLegible}?`)) {
      onFechaSeleccionada(tramo.objetoFecha);
    }
  };

  // Ajuste para deshabilitar fechas pasadas y fines de semana de forma compatible
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const esDiaDeshabilitado = (date) => {
    const day = date.getDay();
    // 0 = Domingo, 6 = Sábado, o si el día es anterior a hoy
    return day === 0 || day === 6 || date < hoy;
  };

  return (
    <div className="contenedor-interfaz-premium">
      {/* COLUMNA IZQUIERDA: El Minicalendario */}
      <div className="columna-calendario">
        <h3>Selecciona un día</h3>
        <DayPicker
          mode="single"
          selected={fechaSeleccionada}
          onSelect={(date) => date && setFechaSeleccionada(date)}
          locale={es}
          disabled={esDiaDeshabilitado} /* 👈 Cambiado por la función unificada */
          className="rdp-diseno-taller"
        />
      </div>

      {/* COLUMNA DERECHA: Lista de Horas en Tarjetas */}
      <div className="columna-horas">
        <h3>Horarios disponibles</h3>
        <p className="fecha-actual-texto">
          {fechaSeleccionada ? fechaSeleccionada.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) : ''}
        </p>
        
        <div className="rejilla-tarjetas-horas">
          {horasDisponibles.map((tramo, index) => (
            <button
              key={index}
              className={`tarjeta-hora ${tramo.disponible ? 'libre' : 'ocupada'}`}
              disabled={!tramo.disponible}
              onClick={() => handleHoraClick(tramo)}
            >
              <span className="hora-texto">{tramo.hora}</span>
              <span className="estado-badge">
                {tramo.disponible ? 'Disponible' : 'Ocupado'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Calendario;