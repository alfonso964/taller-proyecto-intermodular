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
        // RECUERDA: Cambia localhost por tu URL de Render cuando lo subas
        const res = await axios.get('https://taller-proyecto-intermodular.onrender.com/api/citas');
        const citasFormateadas = res.data.map(cita => ({
          title: `Ocupado`,
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
    const hora = fechaSeleccionada.getHours();
    const minutos = fechaSeleccionada.getMinutes();
    const tiempoEnMinutos = hora * 60 + minutos;

    // 1. Validar si es pasado
    if (fechaSeleccionada < ahora) {
      alert("No puedes seleccionar una fecha u hora que ya ha pasado.");
      return;
    }

    // 2. Validar hueco del mediodía (14:00 a 16:00)
    // 14:00 = 840 minutos | 16:00 = 960 minutos
    if (tiempoEnMinutos >= 840 && tiempoEnMinutos < 960) {
      alert("El taller está cerrado de 14:00 a 16:00. Por favor, elige otra hora.");
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
        // --- CONFIGURACIÓN DE HORARIOS ---
        slotMinTime="08:30:00"
        slotMaxTime="19:30:00"
        allDaySlot={false}
        hiddenDays={[0, 6]} // Quitar Sábados y Domingos
        
        // Sombreado visual de horas laborables
        businessHours={[
          {
            daysOfWeek: [1, 2, 3, 4, 5], // Lunes a Viernes
            startTime: '08:30',
            endTime: '14:00',
          },
          {
            daysOfWeek: [1, 2, 3, 4, 5],
            startTime: '16:00',
            endTime: '19:30',
          }
        ]}

        // --- MEJORAS VISUALES ---
        slotEventOverlap={false}
        eventMaxStack={3}
        eventDisplay='block'
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