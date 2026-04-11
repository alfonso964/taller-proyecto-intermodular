import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGasPump, FaRoad } from 'react-icons/fa';
import { supabase } from '../supabaseClient';
import '../styles/TarjetaCoche.css';

const TarjetaCoche = ({ coche, esAdmin, onUpdate }) => {
  const navigate = useNavigate();

  const actualizarEstado = async (nuevoEstado) => {
    const { error } = await supabase
      .from('coches_venta')
      .update({ estado: nuevoEstado })
      .eq('id', coche.id);

    if (error) {
      alert("Error al actualizar: " + error.message);
    } else {
      if (onUpdate) onUpdate(); 
    }
  };

  // Función para ir a la página de detalles
  const verDetalles = () => {
    navigate(`/coches/${coche.id}`);
  };

  return (
    <div className="coche-card">
      {/* Lógica de Admin para cambiar el estado */}
      {esAdmin ? (
        <select 
          className="coche-badge-select admin-mode" 
          value={coche.estado || 'Disponible'} 
          onChange={(e) => actualizarEstado(e.target.value)}
        >
          <option value="Disponible">Disponible</option>
          <option value="Ocasión">Ocasión</option>
          <option value="Seminuevo">Seminuevo</option>
          <option value="Reservado">Reservado</option>
          <option value="Vendido">Vendido</option>
        </select>
      ) : (
        <div className={`coche-badge ${coche.estado?.toLowerCase()}`}>
          {coche.estado || 'Disponible'}
        </div>
      )}

      <img 
        src={coche.imagen} 
        alt={coche.modelo} 
        className="coche-img" 
        onClick={verDetalles} 
        style={{ cursor: 'pointer' }}
      />
      
      <div className="coche-info">
        <div className="coche-header">
          <h4>{coche.marca} {coche.modelo}</h4>
          <span className="coche-precio">{Number(coche.precio).toLocaleString('es-ES')}€</span>
        </div>
        
        <p className="coche-descripcion">
          {coche.descripcion?.substring(0, 80)}...
        </p>
        
        <div className="coche-iconos">
          <span><FaRoad /> {Number(coche.kms).toLocaleString('es-ES')} km</span>
          <span><FaGasPump /> {coche.combustible}</span>
        </div>

        <button className="btn-interesado" onClick={verDetalles}>
          Ver Detalles
        </button>
      </div>
    </div>
  );
};

export default TarjetaCoche;