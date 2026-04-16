/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ModalStock from '../componentes/ModalStock';
import ModalDetalleCita from '../componentes/ModalDetalleCita';
import DashboardStats from '../componentes/DashboardStats';
// He añadido la extensión .jsx para que Vite no tenga dudas al resolver la ruta
import FiltroGestion from '../componentes/FiltrosGestion.jsx';
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

  // Estados para el filtrado
  const [busqueda, setBusqueda] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("todas");

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

  // Lógica de filtrado
  const citasFiltradas = listaCitas.filter(cita => {
    if (cita.estado === 'FINALIZADA') return false;

    const termino = busqueda.toLowerCase();
    const coincideBusqueda = 
      (cita.perfiles?.email || "").toLowerCase().includes(termino) ||
      (cita.contacto_invitado || "").toLowerCase().includes(termino) ||
      cita.marca.toLowerCase().includes(termino) ||
      cita.modelo.toLowerCase().includes(termino);

    if (!coincideBusqueda) return false;

    const fechaCita = new Date(cita.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (filtroFecha === 'hoy') {
      const fechaCitaSinHora = new Date(fechaCita);
      fechaCitaSinHora.setHours(0, 0, 0, 0);
      return fechaCitaSinHora.getTime() === hoy.getTime();
    }

    if (filtroFecha === 'semana') {
      const proximaSemana = new Date(hoy);
      proximaSemana.setDate(hoy.getDate() + 7);
      return fechaCita >= hoy && fechaCita <= proximaSemana;
    }

    return true;
  });

  const abrirDetalleCita = (cita) => {
    setCitaSeleccionada(cita);
    setModalDetalleAbierto(true);
  };

  const toggleFinalizar = async (idCita, estadoActual, e) => {
    e.stopPropagation(); 
    const nuevoEstado = estadoActual === 'FINALIZADA' ? 'PENDIENTE' : 'FINALIZADA';
    const copiaSeguridadLista = [...listaCitas];

    const nuevaListaCitas = listaCitas.map(c => 
      c.id === idCita ? { ...c, estado: nuevoEstado } : c
    );
    
    setListaCitas(nuevaListaCitas);

    try {
      const { error } = await supabase
        .from('citas')
        .update({ estado: nuevoEstado })
        .eq('id', idCita);

      if (error) throw error;
    } catch (error) {
      alert("No se pudo sincronizar el cambio.");
      setListaCitas(copiaSeguridadLista);
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
                <strong>¡Stock Crítico!</strong>
                <p>Quedan {item.stock} de: <em>{item.nombre}</em>.</p>
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
          <FiltroGestion 
            busqueda={busqueda} 
            setBusqueda={setBusqueda} 
            filtroFecha={filtroFecha} 
            setFiltroFecha={setFiltroFecha} 
          />

          {citasFiltradas.length > 0 ? (
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
                  {citasFiltradas.map((cita) => (
                      <tr key={cita.id} onClick={() => abrirDetalleCita(cita)} className="fila-cita">
                      <td className={cita.perfiles?.email ? "cliente-registrado" : "cliente-invitado"}>
                          {cita.perfiles?.email || cita.contacto_invitado || 'Invitado'}
                      </td>
                      <td>{cita.marca} {cita.modelo}</td>
                      <td>{cita.reparacion}</td>
                      <td>{new Date(cita.fecha).toLocaleDateString()}</td>
                      <td>
                          <button 
                            className="btn-estado pendiente" 
                            onClick={(e) => toggleFinalizar(cita.id, cita.estado, e)}
                          >
                          ⏳ En Proceso
                          </button>
                      </td>
                      </tr>
                  ))}
              </tbody>
              </table>
          </div>
          ) : (
          <div className="contenedor-lista-vacia">
            <p>No se han encontrado citas.</p>
          </div>
          )}
      </div>

      <ModalStock isOpen={modalAbierto} onClose={() => setModalAbierto(false)} onUpdate={cargarDatosReales} />
      <ModalDetalleCita isOpen={modalDetalleAbierto} onClose={() => setModalDetalleAbierto(false)} cita={citaSeleccionada} onUpdate={cargarDatosReales} />
    </div>
  );
};

export default Admin;