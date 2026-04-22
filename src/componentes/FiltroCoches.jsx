import React, { useState, useEffect } from 'react';
import '../styles/FiltrosCoches.css';

const FiltrosCoches = ({ alFiltrar }) => {
  const [busqueda, setBusqueda] = useState('');
  const [combustible, setCombustible] = useState('');
  const [precioMax, setPrecioMax] = useState(100000);
  const [potenciaMin, setPotenciaMin] = useState(0);

  // Enviamos los filtros al padre cada vez que cambien
  useEffect(() => {
    const handler = setTimeout(() => {
      alFiltrar({ busqueda, combustible, precioMax, potenciaMin });
    }, 300); // Debounce de 300ms

    return () => clearTimeout(handler);
  }, [busqueda, combustible, precioMax, potenciaMin]);

  return (
    <div className="contenedor-filtros">
      <div className="filtro-grupo">
        <label>Buscar marca o modelo</label>
        <input 
          type="text" 
          placeholder="Ej: Cupra..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="filtro-grupo">
        <label>Combustible</label>
        <select value={combustible} onChange={(e) => setCombustible(e.target.value)}>
          <option value="">Todos</option>
          <option value="Gasolina">Gasolina</option>
          <option value="Diésel">Diésel</option>
          <option value="Híbrido">Híbrido</option>
          <option value="Eléctrico">Eléctrico</option>
        </select>
      </div>

      <div className="filtro-grupo">
        <label>Precio máximo: {precioMax}€</label>
        <input 
          type="range" 
          min="5000" 
          max="100000" 
          step="1000"
          value={precioMax}
          onChange={(e) => setPrecioMax(e.target.value)}
        />
      </div>

      <div className="filtro-grupo">
        <label>Potencia mínima: {potenciaMin} CV</label>
        <input 
          type="range" 
          min="0" 
          max="600" 
          step="10"
          value={potenciaMin}
          onChange={(e) => setPotenciaMin(e.target.value)}
        />
      </div>

      <button className="btn-limpiar" onClick={() => {
        setBusqueda('');
        setCombustible('');
        setPrecioMax(100000);
        setPotenciaMin(0);
      }}>
        Limpiar filtros
      </button>
    </div>
  );
};

export default FiltrosCoches;