/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/Admin.css';

const Admin = () => {
  const [resumen, setResumen] = useState({ citas: 0, usuarios: 0 });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatosReales = async () => {
      try {
        // 1. Contar usuarios reales en la tabla 'perfiles'
        const { count: conteoUsuarios, error: errUser } = await supabase
          .from('perfiles')
          .select('*', { count: 'exact', head: true });

        // 2. Contar citas reales en la tabla 'Cita'
        const { count: conteoCitas, error: errCita } = await supabase
          .from('Cita')
          .select('*', { count: 'exact', head: true });

        if (errUser || errCita) console.error("Error al obtener datos:", errUser || errCita);

        setResumen({ 
          citas: conteoCitas || 0, 
          usuarios: conteoUsuarios || 0 
        });
      } catch (error) {
        console.error("Error de conexión:", error);
      } finally {
        setCargando(false);
      }
    };
    
    cargarDatosReales();
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
          <p className="valor-dato">{cargando ? "..." : resumen.citas}</p>
        </div>
        <div className="tarjeta-dato">
          <h3>Usuarios Totales</h3>
          <p className="valor-dato">{cargando ? "..." : resumen.usuarios}</p>
        </div>
        <div className="tarjeta-dato">
          <h3>Ingresos Estimados</h3>
          {/* Este valor lo calcularemos cuando tengas facturas o precios */}
          <p className="valor-dato">0€</p>
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

