import React from 'react';
import '../styles/StatsBanner.css';
import { LayoutDashboard, CheckCircle, Clock, Car } from 'lucide-react'; 

const StatsBanner = ({ estadisticas }) => {
  // Extraemos los datos que vendrán de tu base de datos
  // Si estadisticas es undefined, ponemos 0 por defecto para evitar errores
  const { total = 0, finalizadas = 0, pendientes = 0, vehiculos = 0 } = estadisticas || {};

  return (
    <div className="contenedor-banner-stats">
      <div className="tarjeta-stat">
        <div className="icono-stat total">
          <LayoutDashboard size={20} />
        </div>
        <div className="info-stat">
          <span className="valor-stat">{total}</span>
          <span className="etiqueta-stat">Total Reparaciones</span>
        </div>
      </div>

      <div className="tarjeta-stat">
        <div className="icono-stat completada">
          <CheckCircle size={20} />
        </div>
        <div className="info-stat">
          <span className="valor-stat">{finalizadas}</span>
          <span className="etiqueta-stat">Finalizadas</span>
        </div>
      </div>

      <div className="tarjeta-stat">
        <div className="icono-stat proceso">
          <Clock size={20} />
        </div>
        <div className="info-stat">
          <span className="valor-stat">{pendientes}</span>
          <span className="etiqueta-stat">En Proceso</span>
        </div>
      </div>

      <div className="tarjeta-stat">
        <div className="icono-stat vehiculos">
          <Car size={20} />
        </div>
        <div className="info-stat">
          <span className="valor-stat">{vehiculos}</span>
          <span className="etiqueta-stat">Vehículos en Taller</span>
        </div>
      </div>
    </div>
  );
};

export default StatsBanner;