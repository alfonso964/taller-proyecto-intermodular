/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ModalStock from '../componentes/ModalStock';
import ModalDetalleCita from '../componentes/ModalDetalleCita'; // IMPORTACIÓN NUEVA
import '../styles/Admin.css';

const Admin = () => {
  const [resumen, setResumen] = useState({ citas: 0, usuarios: 0, piezas: 0 });
  const [listaCitas, setListaCitas] = useState([]); 
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  
  // ESTADOS NUEVOS PARA EL DETALLE
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);

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

  // FUNCIÓN NUEVA PARA ABRIR EL DETALLE
  const abrirDetalleCita = (cita) => {
    setCitaSeleccionada(cita);
    setModalDetalleAbierto(true);
  };

  const toggleFinalizar = async (idCita, estadoActual, e) => {
    // IMPORTANTE: stopPropagation evita que se abra el modal de detalle al pulsar el botón
    e.stopPropagation(); 
    try {
      const nuevoEstado = estadoActual === 'FINALIZADA' ? 'PENDIENTE' : 'FINALIZADA';

      const { error } = await supabase
        .from('citas')
        .update({ estado: nuevoEstado })
        .eq('id', idCita);

      if (error) throw error;
      
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
                  const esFinalizada = cita.estado === 'FINALIZADA';

                  return (
                    <tr 
                      key={cita.id} 
                      onClick={() => abrirDetalleCita(cita)} // CLICK EN FILA ABRE DETALLE
                      style={{ cursor: 'pointer' }}
                      className="fila-cita"
                    >
                      <td className={cita.perfiles?.email ? "cliente-registrado" : "cliente-invitado"}>
                        {cita.perfiles?.email || cita.contacto_invitado || 'Invitado'}
                      </td>
                      <td>{cita.marca} {cita.modelo}</td>
                      <td>{cita.reparacion}</td>
                      <td>{new Date(cita.fecha).toLocaleDateString()}</td>
                      <td>
                        <button 
                          className={`btn-estado ${esFinalizada ? 'finalizado' : 'pendiente'}`}
                          onClick={(e) => toggleFinalizar(cita.id, cita.estado, e)} // PASAMOS 'e'
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

      {/* MODAL DE INVENTARIO (TUYO ORIGINAL) */}
      <ModalStock
        isOpen={modalAbierto} 
        onClose={() => setModalAbierto(false)} 
        onUpdate={cargarDatosReales} 
      />

      {/* MODAL DE DETALLE DE CITA (NUEVO) */}
      <ModalDetalleCita 
        isOpen={modalDetalleAbierto}
        onClose={() => setModalDetalleAbierto(false)}
        cita={citaSeleccionada}
        onUpdate={cargarDatosReales}
      />
    </div>
  );
};

export default Admin;