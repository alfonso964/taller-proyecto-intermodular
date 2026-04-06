import React from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import '../styles/BarraFiltros.css';

const BarraFiltros = ({ alFiltrar, filtroEstado, alCambiarEstado }) => {
  return (
    <div className="contenedor-barra-filtros">
      <div className="seccion-busqueda">
        <FaSearch className="icono-busqueda" />
        <input 
          type="text" 
          placeholder="Buscar por matrícula, modelo o avería..." 
          onChange={(e) => alFiltrar(e.target.value)}
          className="input-busqueda"
        />
      </div>

      <div className="seccion-botones">
        <span className="texto-filtro"><FaFilter size={12} /> Estados:</span>
        <div className="grupo-pills">
          {['TODAS', 'PENDIENTE', 'FINALIZADA'].map((estado) => (
            <button
              key={estado}
              className={`boton-pill ${filtroEstado === estado ? 'activo' : ''}`}
              onClick={() => alCambiarEstado(estado)}
            >
              {estado === 'TODAS' ? 'Todas' : estado.charAt(0) + estado.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BarraFiltros;