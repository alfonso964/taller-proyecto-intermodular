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

      const { data: datosCitas, count: conteoCitas, error: errCita } = await supabase
        .from('citas')
        .select(`*, perfiles ( email )`, { count: 'exact' });

      if (errCita) throw errCita;

      const { data: dataStockBajo } = await supabase
        .from('piezas')
        .select('nombre, stock')
        .lt('stock', 3);
      setAlertasStock(dataStockBajo || []);

      // --- CÁLCULO DE BENEFICIO NETO REAL ---
      const { data: datosDinero } = await supabase
        .from('resumen_economico_citas')
        .select('total_venta, total_coste, beneficio_neto');
      
      // Sumamos la columna beneficio_neto que ya tienes en tu vista de Supabase
      const beneficioReal = datosDinero?.reduce((acc, curr) => acc + (curr.beneficio_neto || 0), 0) || 0;

      const { data: dataVinculaciones } = await supabase
        .from('cita_piezas')
        .select('cantidad, piezas(nombre)');
      setTodasLasPiezasUsadas(dataVinculaciones || []);

      setResumen({ 
        citas: conteoCitas || 0, 
        usuarios: conteoUsuarios || 0,
        piezas: conteoPiezas || 0,
        ingresos: beneficioReal // Ahora muestra el beneficio neto
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
      cargarDatosReales(); 
    } catch (error) {
      console.error("Error Supabase:", error);
      alert("Error al actualizar el estado");
    }
  };

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
          <h3>Citas Totales</h3>
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
        <div className="tarjeta-dato destaque-verde">
          <h3>Beneficio Neto</h3>
          <p className="valor-dato">{cargando ? "..." : `${resumen.ingresos.toFixed(2)}€`}</p>
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
                      <tr key={cita.id} onClick={() => abrirDetalleCita(cita)} style={{ cursor: 'pointer' }} className="fila-cita">
                      <td className={cita.perfiles?.email ? "cliente-registrado" : "cliente-invitado"}>
                          {cita.perfiles?.email || cita.contacto_invitado || 'Invitado'}
                      </td>
                      <td>{cita.marca} {cita.modelo}</td>
                      <td>{cita.reparacion}</td>
                      <td>{new Date(cita.fecha).toLocaleDateString()}</td>
                      <td>
                          <button className={`btn-estado ${esFinalizada ? 'finalizado' : 'pendiente'}`} onClick={(e) => toggleFinalizar(cita.id, cita.estado, e)}>
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
          <div className="contenedor-lista-vacia"><p>No hay reparaciones activas.</p></div>
          )}
      </div>

      <ModalStock isOpen={modalAbierto} onClose={() => setModalAbierto(false)} onUpdate={cargarDatosReales} />
      <ModalDetalleCita isOpen={modalDetalleAbierto} onClose={() => setModalDetalleAbierto(false)} cita={citaSeleccionada} onUpdate={cargarDatosReales} />
    </div>
  );
};

export default Admin;