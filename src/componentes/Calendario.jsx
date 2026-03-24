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
        const res = await axios.get('http://localhost:3000/api/citas');
        const citasFormateadas = res.data.map(cita => ({
          title: `Ocupado: ${cita.reparacion}`,
          start: cita.fecha,
          end: new Date(new Date(cita.fecha).getTime() + (cita.duracionEstimada || 60) * 60000),
          className: 'cita-ocupada' 
        }));
        setEventos(citasFormateadas);
      } catch (err) {
        console.error("Error al cargar citas:", err);
      }
    };
    cargarCitas();
  }, []);

  const handleDateClick = (info) => {
    const fechaSeleccionada = new Date(info.date);
    const ahora = new Date();

    if (fechaSeleccionada < ahora) {
      alert("No puedes seleccionar una fecha o hora que ya ha pasado.");
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
        // --- MEJORAS VISUALES PARA SOLAPAMIENTO ---
        slotEventOverlap={false}    // Evita que los eventos se monten encima de otros
        eventMaxStack={3}           // Agrupa visualmente si hay más de 3
        eventDisplay='block'        // Aprovecha mejor el ancho de la columna
        // ------------------------------------------
        hiddenDays={[0, 6]}
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        allDaySlot={false}
        events={eventos}
        dateClick={handleDateClick}
        height="650px"
        selectable={true}
        nowIndicator={true}
        validRange={{
          start: new Date().toISOString().split('T')[0] 
        }}
      />
    </div>
  );
}

export default Calendario;