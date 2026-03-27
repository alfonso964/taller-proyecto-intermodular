/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/Admin.css';

const Admin = () => {
  const [resumen, setResumen] = useState({ citas: 0, usuarios: 0 });
  const [listaCitas, setListaCitas] = useState([]); // Nuevo estado para la tabla
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatosReales = async () => {
      try {
        // 1. Contar usuarios reales en la tabla 'perfiles'
        const { count: conteoUsuarios, error: errUser } = await supabase
          .from('perfiles')
          .select('*', { count: 'exact', head: true });

        // 2. Traer la LISTA de citas vinculada con el EMAIL del perfil
        const { data: datosCitas, count: conteoCitas, error: errCita } = await supabase
          .from('citas')
          .select(`
            *,
            perfiles (
              email
            )
          `, { count: 'exact' });

        if (errUser || errCita) console.error("Error al obtener datos:", errUser || errCita);

        setResumen({ 
          citas: conteoCitas || 0, 
          usuarios: conteoUsuarios || 0 
        });
        
        setListaCitas(datosCitas || []); // Guardamos las citas reales en el estado

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
      
      {/* TARJETAS DE ESTADÍSTICAS (Ahora en azul medianoche por el CSS) */}
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
          <p className="valor-dato">0€</p>
        </div>
      </div>

      {/* SECCIÓN DE GESTIÓN DE REPARACIONES */}
      <div className="zona-gestion">
        <div className="cabecera-seccion">
          <h2>Gestión de Reparaciones Activas</h2>
        </div>

        {listaCitas.length > 0 ? (
          <div className="tabla-contenedor" style={{ overflowX: 'auto' }}>
            <table className="tabla-admin">
              <thead>
                <tr>
                  <th>Cliente (Email)</th>
                  <th>Vehículo</th>
                  <th>Reparación</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {listaCitas.map((cita) => (
                  <tr key={cita.id}>
                    {/* Mostramos el email que viene del JOIN con perfiles */}
                    <td style={{ color: '#38bdf8', fontWeight: 'bold' }}>
                        {cita.perfiles?.email || 'Usuario General'}
                    </td>
                    <td>{cita.marca} {cita.modelo} ({cita.anio})</td>
                    <td>{cita.reparacion}</td>
                    <td>{new Date(cita.fecha).toLocaleDateString()}</td>
                    <td>
                      <span className="etiqueta-estado">
                        {cita.estado || 'Pendiente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="contenedor-lista-vacia">
            <p>No hay reparaciones activas para mostrar.</p>
            <span>Las citas solicitadas por los clientes aparecerán aquí automáticamente.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;