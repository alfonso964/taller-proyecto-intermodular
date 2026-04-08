/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ModalStock from '../componentes/ModalStock';
import ModalDetalleCita from '../componentes/ModalDetalleCita';
import DashboardStats from '../componentes/DashboardStats';
import '../styles/Admin.css';

const Admin = () => {
  const [resumen, setResumen] = useState({ citas: 0, usuarios: 0, piezas: 0, ingresos: 0 });
  const [listaCitas, setListaCitas] = useState([]); 
  const [todasLasPiezasUsadas, setTodasLasPiezasUsadas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [alertasStock, setAlertasStock] = useState([]);

  const cargarDatosReales = async () => {
    try {
      const { count: conteoUsuarios } = await supabase
        .from('perfiles')
        .select('*', { count: 'exact', head: true });

      const { count: conteoPiezas } = await supabase
        .from('piezas')
        .select('*', { count: 'exact', head: true });

      const { data: datosCitas, error: errCita } = await supabase
        .from('citas')
        .select(`*, perfiles ( email )`);

      if (errCita) throw errCita;

      const citasActivasCount = datosCitas?.filter(c => c.estado !== 'FINALIZADA').length || 0;

      const { data: dataStockBajo } = await supabase
        .from('piezas')
        .select('nombre, stock')
        .lt('stock', 3);
      setAlertasStock(dataStockBajo || []);

      const { data: datosDinero } = await supabase
        .from('resumen_economico_citas')
        .select('total_venta, total_coste, beneficio_neto');
      
      const beneficioReal = datosDinero?.reduce((acc, curr) => acc + (curr.beneficio_neto || 0), 0) || 0;

      // ← ÚNICO CAMBIO: añadidos id_cita, precio y precio_coste
      const { data: dataVinculaciones } = await supabase
        .from('cita_piezas')
        .select('id_cita, cantidad, piezas(nombre, precio, precio_coste)');
      setTodasLasPiezasUsadas(dataVinculaciones || []);

      setResumen({ 
        citas: citasActivasCount,
        usuarios: conteoUsuarios || 0,
        piezas: conteoPiezas || 0,
        ingresos: beneficioReal 
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

  const abrirDetalleCita = (cita) => {
    setCitaSeleccionada(cita);
    setModalDetalleAbierto(true);
  };

  const toggleFinalizar = async (idCita, estadoActual, e) => {
    e.stopPropagation(); 
    
    const nuevoEstado = estadoActual === 'FINALIZADA' ? 'PENDIENTE' : 'FINALIZADA';

    const copiaSeguridadLista = [...listaCitas];
    const copiaSeguridadResumen = { ...resumen };

    const nuevaListaCitas = listaCitas.map(c => 
      c.id === idCita ? { ...c, estado: nuevoEstado } : c
    );
    
    setListaCitas(nuevaListaCitas);
    
    const nuevasActivas = nuevaListaCitas.filter(c => c.estado !== 'FINALIZADA').length;
    setResumen(prev => ({ ...prev, citas: nuevasActivas }));

    try {
      const { error } = await supabase
        .from('citas')
        .update({ estado: nuevoEstado })
        .eq('id', idCita);

      if (error) throw error;
      
      console.log("Estado actualizado en servidor");
      
    } catch (error) {
      console.error("Error en servidor:", error);
      alert("No se pudo sincronizar el cambio. Reintentando...");
      
      setListaCitas(copiaSeguridadLista);
      setResumen(copiaSeguridadResumen);
    }
  };

  const citasParaMostrar = listaCitas.filter(cita => cita.estado !== 'FINALIZADA');

  return (
    <div className="admin-principal">
      <header className="admin-cabecera">
        <h1 className="admin-titulo">
          Panel de Control <span className="etiqueta-admin">Admin</span>
        </h1>
        <button className="btn-abrir-inventario" onClick={() => setModalAbierto(true)}>
          📦 Gestionar Inventario
        </button>
      </header>

      {alertasStock.length > 0 && (
        <div className="banner-alertas-stock">
          {alertasStock.map((item, idx) => (
            <div key={idx} className="alerta-stock-item">
              <span className="icono-alerta">⚠️</span>
              <div className="info-alerta">
                <strong>¡Atención Stock Crítico!</strong>
                <p>Quedan solo {item.stock} unidades de: <em>{item.nombre}</em>.</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="cuadricula-resumen">
        <div className="tarjeta-dato">
          <h3>Citas Activas</h3>
          <p className="valor-dato">{cargando ? "..." : resumen.citas}</p>
        </div>
        <div className="tarjeta-dato">
          <h3>Usuarios</h3>
          <p className="valor-dato">{cargando ? "..." : resumen.usuarios}</p>
        </div>
        <div className="tarjeta-dato">
          <h3>Piezas</h3>
          <p className="valor-dato">{cargando ? "..." : resumen.piezas}</p>
        </div>
      </div>

      {!cargando && (
        <DashboardStats 
          listaCitas={listaCitas} 
          piezasUsadas={todasLasPiezasUsadas} 
        />
      )}

      <div className="zona-gestion">
          <div className="cabecera-seccion">
            <h2>Gestión de Reparaciones Activas</h2>
          </div>

          {citasParaMostrar.length > 0 ? (
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
                  {citasParaMostrar.map((cita) => {
                  const esFinalizada = cita.estado === 'FINALIZADA';
                  return (
                      <tr key={cita.id} onClick={() => abrirDetalleCita(cita)} style={{ cursor: 'pointer' }} className="fila-cita">
                      <td className={cita.perfiles?.email ? "cliente-registrado" : "cliente-invitado"}>
                          {cita.perfiles?.email || cita.contacto_invitado || 'Invitado'}
                      </td>
                      <td>{cita.marca} {cita.modelo}</td>
                      <td>{cita.reparacion}</td>
                      <td>{new Date(cita.fecha).toLocaleDateString()}</td>
                      <td>
                          <button 
                            className={`btn-estado ${esFinalizada ? 'finalizado' : 'pendiente'}`} 
                            onClick={(e) => toggleFinalizar(cita.id, cita.estado, e)}
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
          <div className="contenedor-lista-vacia"><p>No hay reparaciones activas por el momento.</p></div>
          )}
      </div>

      <ModalStock isOpen={modalAbierto} onClose={() => setModalAbierto(false)} onUpdate={cargarDatosReales} />
      <ModalDetalleCita isOpen={modalDetalleAbierto} onClose={() => setModalDetalleAbierto(false)} cita={citaSeleccionada} onUpdate={cargarDatosReales} />
    </div>
  );
};

export default Admin;