/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTools, FaHistory, FaClock, FaCheckDouble, FaCarSide, FaEuroSign } from 'react-icons/fa';
import StatsBanner from '../componentes/StatsBanner';
import BarraFiltros from '../componentes/BarraFiltros'; 
import '../styles/MisReparaciones.css';

function MisReparaciones() {
  const [reparaciones, setReparaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODAS');

  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    finalizadas: 0,
    pendientes: 0,
    vehiculos: 0
  });

  useEffect(() => {
    fetchReparaciones();
  }, []);

  const calcularEstadisticas = (datos) => {
    const stats = {
      total: datos.length,
      finalizadas: datos.filter(r => r.estado?.toUpperCase() === 'FINALIZADA').length,
      // Solo contamos como pendiente lo que explícitamente sea PENDIENTE
      pendientes: datos.filter(r => r.estado?.toUpperCase() === 'PENDIENTE').length,
      vehiculos: new Set(datos.map(r => r.matricula?.toUpperCase() || `${r.marca}-${r.modelo}`)).size 
    };
    setEstadisticas(stats);
  };

  const fetchReparaciones = async () => {
    try {
      setCargando(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;

      if (user) {
        const { data, error } = await supabase
          .from('citas')
          .select('*')
          .eq('id_usuario', user.id) 
          .order('fecha', { ascending: false });

        if (error) throw error;
        
        setReparaciones(data || []);
        calcularEstadisticas(data || []);
      }
      setCargando(false);
    } catch (error) {
      console.error("Error al cargar historial:", error.message);
      setCargando(false);
    }
  };

  const reparacionesFiltradas = reparaciones.filter(rep => {
    const coincideEstado = filtroEstado === 'TODAS' || rep.estado?.toUpperCase() === filtroEstado;
    const textoBusqueda = busqueda.toLowerCase();
    const coincideTexto = 
      rep.marca?.toLowerCase().includes(textoBusqueda) ||
      rep.modelo?.toLowerCase().includes(textoBusqueda) ||
      rep.matricula?.toLowerCase().includes(textoBusqueda) ||
      rep.reparacion?.toLowerCase().includes(textoBusqueda);
    
    return coincideEstado && coincideTexto;
  });

  const getIconoEstado = (estado) => {
    switch (estado?.toUpperCase()) {
      case 'PENDIENTE': return <FaClock color="#f39c12" />;
      case 'FINALIZADA': return <FaCheckDouble color="#22c55e" />;
      default: return <FaHistory />;
    }
  };

  return (
    <div className="historial-layout">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="historial-header"
      >
        <h1><FaHistory /> Mi Historial de Reparaciones</h1>
        <p>Gestiona los vehículos de tu flota y consulta desgloses de costes.</p>
      </motion.div>

      {!cargando && (
        <>
          <StatsBanner estadisticas={estadisticas} />
          
          <BarraFiltros 
            alFiltrar={setBusqueda} 
            filtroEstado={filtroEstado} 
            alCambiarEstado={setFiltroEstado} 
          />
        </>
      )}

      <div className="historial-grid">
        <AnimatePresence mode="popLayout">
          {cargando ? (
            <motion.p key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="status-msg">
              Consultando base de datos...
            </motion.p>
          ) : reparacionesFiltradas.length === 0 ? (
            <motion.div key="empty" className="sin-datos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p>{busqueda || filtroEstado !== 'TODAS' ? "No hay reparaciones que coincidan con el filtro." : "No tienes ninguna reparación registrada."}</p>
            </motion.div>
          ) : (
            reparacionesFiltradas.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="card-reparacion"
              >
                <div className="card-top">
                  <span className="fecha-badge">
                    {item.fecha ? new Date(item.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '---'}
                  </span>
                  <div className={`estado-tag ${item.estado?.toLowerCase().replace(/\s+/g, "-")}`}>
                    {getIconoEstado(item.estado)}
                    <span>{item.estado || 'PENDIENTE'}</span>
                  </div>
                </div>

                <div className="card-body">
                  <div className="vehiculo-info">
                    <h2 className="vehiculo-titulo">{item.marca} {item.modelo}</h2>
                    {item.matricula && <span className="matricula-tag"><FaCarSide /> {item.matricula.toUpperCase()}</span>}
                  </div>
                  
                  <p className="reparacion-desc"><strong>Motivo:</strong> {item.reparacion}</p>
                  
                  <div className="piezas-box">
                    <span className="piezas-label">Detalles de la intervención:</span>
                    <p>{item.piezas || "Pendiente de desglose técnico."}</p>
                  </div>

                  {(item.precio_total > 0) && (
                    <div className="coste-box">
                      <FaEuroSign size={14} />
                      <span>Total Reparación: <strong>{item.precio_total}€</strong></span>
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <span>KM: {item.kilometraje || '---'}</span>
                  <span>Año: {item.anio || '---'}</span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default MisReparaciones;