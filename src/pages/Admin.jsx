/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ModalStock from '../componentes/ModalStock';
import '../styles/Admin.css';

const Admin = () => {
  const [resumen, setResumen] = useState({ citas: 0, usuarios: 0, piezas: 0 });
  const [listaCitas, setListaCitas] = useState([]); 
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);

  const cargarDatosReales = async () => {
    try {
      const { count: conteoUsuarios } = await supabase
        .from('perfiles')
        .select('*', { count: 'exact', head: true });

      const { count: conteoPiezas } = await supabase
        .from('piezas')
        .select('*', { count: 'exact', head: true });

      const { data: datosCitas, count: conteoCitas, error: errCita } = await supabase
        .from('citas')
        .select(`
          *,
          perfiles ( email )
        `, { count: 'exact' });

      if (errCita) throw errCita;

      setResumen({ 
        citas: conteoCitas || 0, 
        usuarios: conteoUsuarios || 0,
        piezas: conteoPiezas || 0
      });
      
      setListaCitas(datosCitas || []); 

    } catch (error) {
      console.error("Error al cargar datos:", error.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatosReales();
  }, []);

  // Función corregida: Usamos la columna 'estado' y valores de texto
  const toggleFinalizar = async (idCita, estadoActual) => {
    try {
      // Determinamos el nuevo texto basado en lo que hay en la BD
      const nuevoEstado = estadoActual === 'FINALIZADA' ? 'PENDIENTE' : 'FINALIZADA';

      const { error } = await supabase
        .from('citas')
        .update({ estado: nuevoEstado }) // CAMBIO: Usamos 'estado' en lugar de 'finalizada'
        .eq('id', idCita);

      if (error) throw error;
      
      // Actualizamos el estado local para que el botón cambie al instante
      setListaCitas(prev => 
        prev.map(c => c.id === idCita ? { ...c, estado: nuevoEstado } : c)
      );
    } catch (error) {
      console.error("Error Supabase:", error);
      alert("Error al actualizar el estado en la base de datos");
    }
  };

  return (
    <div className="admin-principal">
      <header className="admin-cabecera">
        <h1 className="admin-titulo">
          Panel de Control <span className="etiqueta-admin">Admin</span>
        </h1>
        
        <button 
          className="btn-abrir-inventario" 
          onClick={() => setModalAbierto(true)}
        >
          📦 Gestionar Inventario
        </button>
      </header>
      
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
          <h3>Piezas Inventario</h3>
          <p className="valor-dato">{cargando ? "..." : resumen.piezas}</p>
        </div>
      </div>

      <div className="zona-gestion">
        <div className="cabecera-seccion">
          <h2>Gestión de Reparaciones Activas</h2>
        </div>

        {listaCitas.length > 0 ? (
          <div className="tabla-contenedor">
            <table className="tabla-admin">
              <thead>
                <tr>
                  <th>Cliente / Contacto</th>
                  <th>Vehículo</th>
                  <th>Reparación</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {listaCitas.map((cita) => {
                  // Lógica para determinar si visualmente está finalizada
                  const esFinalizada = cita.estado === 'FINALIZADA';

                  return (
                    <tr key={cita.id}>
                      <td className={cita.perfiles?.email ? "cliente-registrado" : "cliente-invitado"}>
                        {cita.perfiles?.email || cita.contacto_invitado || 'Invitado'}
                      </td>
                      <td>{cita.marca} {cita.modelo}</td>
                      <td>{cita.reparacion}</td>
                      <td>{new Date(cita.fecha).toLocaleDateString()}</td>
                      <td>
                        <button 
                          className={`btn-estado ${esFinalizada ? 'finalizado' : 'pendiente'}`}
                          onClick={() => toggleFinalizar(cita.id, cita.estado)}
                        >
                          {esFinalizada ? '✅ Finalizada' : '⏳ En Proceso'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="contenedor-lista-vacia">
            <p>No hay reparaciones activas.</p>
          </div>
        )}
      </div>

      <ModalStock
        isOpen={modalAbierto} 
        onClose={() => setModalAbierto(false)} 
        onUpdate={cargarDatosReales} 
      />
    </div>
  );
};

export default Admin;