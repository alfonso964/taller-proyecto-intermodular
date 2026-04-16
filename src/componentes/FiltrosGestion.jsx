import React from 'react';
import { FaSearch, FaCalendarDay, FaCalendarWeek, FaListUl } from 'react-icons/fa';

const FiltroGestion = ({ busqueda, setBusqueda, filtroFecha, setFiltroFecha }) => {
  return (
    <div className="cabecera-seccion-filtros">
      <h2>Gestión de Reparaciones</h2>
      
      <div className="controles-tabla">
        {/* Buscador */}
        <div className="buscador-admin">
          <FaSearch />
          <input 
            type="text" 
            placeholder="Buscar cliente, marca..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Selectores de tiempo */}
        <div className="filtros-tiempo">
          <button 
            className={filtroFecha === 'hoy' ? 'active' : ''} 
            onClick={() => setFiltroFecha('hoy')}
            title="Ver citas de hoy"
          >
            <FaCalendarDay /> Hoy
          </button>
          <button 
            className={filtroFecha === 'semana' ? 'active' : ''} 
            onClick={() => setFiltroFecha('semana')}
            title="Ver citas de los próximos 7 días"
          >
            <FaCalendarWeek /> Semana
          </button>
          <button 
            className={filtroFecha === 'todas' ? 'active' : ''} 
            onClick={() => setFiltroFecha('todas')}
            title="Ver todas las citas activas"
          >
            <FaListUl /> Todas
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltroGestion;