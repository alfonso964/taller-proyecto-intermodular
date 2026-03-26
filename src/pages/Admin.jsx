/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/Admin.css';

const Admin = () => {
  const [resumen, setResumen] = useState({ citas: 0, usuarios: 0 });

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      // Simulación de datos hasta que conectemos las tablas reales
      setResumen({ citas: 5, usuarios: 12 });
    };
    cargarDatosIniciales();
  }, []);

  return (
    <div className="admin-principal">
      <header className="admin-cabecera">
        <h1 className="admin-titulo">
          Panel de Control <span className="etiqueta-admin">Admin</span>
        </h1>
      </header>
      
      {/* TARJETAS DE ESTADÍSTICAS */}
      <div className="cuadricula-resumen">
        <div className="tarjeta-dato">
          <h3>Citas Pendientes</h3>
          <p className="valor-dato">{resumen.citas}</p>
        </div>
        <div className="tarjeta-dato">
          <h3>Usuarios Totales</h3>
          <p className="valor-dato">{resumen.usuarios}</p>
        </div>
        <div className="tarjeta-dato">
          <h3>Ingresos Estimados</h3>
          <p className="valor-dato">1.250€</p>
        </div>
      </div>

      {/* SECCIÓN DE GESTIÓN DE REPARACIONES */}
      <div className="zona-gestion">
        <div className="cabecera-seccion">
          <h2>Gestión de Reparaciones</h2>
        </div>
        <div className="contenedor-lista-vacia">
          <p>No hay reparaciones activas para mostrar.</p>
          <span>Aquí podrás añadir piezas y precios próximamente.</span>
        </div>
      </div>
    </div>
  );
};

export default Admin;