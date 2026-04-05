import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { useEffect, useState } from 'react';
import axios from 'axios';

import '../styles/Calendario.css';

function Calendario({ onFechaSeleccionada }) {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const cargarCitas = async () => {
      try {
        const res = await axios.get('https://taller-proyecto-intermodular.onrender.com/api/citas');
        const citasFormateadas = res.data.map(cita => ({
          title: `Ocupado`,
          start: cita.fecha,
          end: new Date(new Date(cita.fecha).getTime() + (cita.duracionEstimada || 60) * 60000),
          className: 'cita-ocupada',
          display: 'background', // Esto hace que resalte el bloque como ocupado
          backgroundColor: '#ffcccc',
          overlap: false
        }));
        setEventos(citasFormateadas);
      } catch (err) {
        console.error("Error al cargar citas:", err);
      }
    };
    cargarCitas();
  }, []);

  const esHorarioValido = (fecha) => {
    const hora = fecha.getHours();
    const minutos = fecha.getMinutes();
    const totalMinutos = hora * 60 + minutos;

    const mañanaInicio = 8 * 60 + 30; // 08:30
    const mañanaFin = 14 * 60;      // 14:00
    const tardeInicio = 16 * 60;     // 16:00
    const tardeFin = 19 * 60 + 30;   // 19:30

    const esMañana = totalMinutos >= mañanaInicio && totalMinutos < mañanaFin;
    const esTarde = totalMinutos >= tardeInicio && totalMinutos < tardeFin;

    return esMañana || esTarde;
  };

  const handleDateClick = (info) => {
    const fechaSeleccionada = new Date(info.date);
    const ahora = new Date();

    if (fechaSeleccionada < ahora) {
      alert("No puedes seleccionar una fecha u hora que ya ha pasado.");
      return;
    }

    if (!esHorarioValido(fechaSeleccionada)) {
      alert("El taller está cerrado en este horario (08:30-14:00 y 16:00-19:30).");
      return;
    }

    const fechaLegible = fechaSeleccionada.toLocaleString('es-ES', { 
      weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' 
    });
    
    if (window.confirm(`¿Confirmas la reserva para el ${fechaLegible}?`)) {
      onFechaSeleccionada(info.date);
    }
  };

  return (
    <div className="contenedor-calendario-taller">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        locale={esLocale}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridWeek,timeGridDay'
        }}
        slotMinTime="08:00:00"
        slotMaxTime="20:30:00"
        allDaySlot={false}
        hiddenDays={[0, 6]} 
        slotDuration="00:30:00"
        snapDuration="00:30:00"
        
        businessHours={[
          {
            daysOfWeek: [1, 2, 3, 4, 5],
            startTime: '08:30',
            endTime: '14:00',
          },
          {
            daysOfWeek: [1, 2, 3, 4, 5],
            startTime: '16:00',
            endTime: '19:30',
          }
        ]}

        // Restricciones visuales y de interacción
        selectConstraint="businessHours"
        eventConstraint="businessHours"
        slotEventOverlap={false}
        events={eventos}
        dateClick={handleDateClick}
        height="auto"
        nowIndicator={true}
        selectable={true}
        selectMirror={true}
        validRange={{
          start: new Date().toISOString().split('T')[0] 
        }}
      />
    </div>
  );
}

export default Calendario;