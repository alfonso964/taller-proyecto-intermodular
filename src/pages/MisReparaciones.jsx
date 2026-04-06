/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTools, FaHistory, FaClock, FaCheckDouble } from 'react-icons/fa';
import '../styles/MisReparaciones.css';

function MisReparaciones() {
  const [reparaciones, setReparaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetchReparaciones();
  }, []);

  const fetchReparaciones = async () => {
    try {
      setCargando(true);
      // 1. Obtener el usuario actual
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;

      if (user) {
        // 2. Traer las citas filtradas por el ID del usuario logueado
        const { data, error } = await supabase
          .from('citas')
          .select('*')
          .eq('id_usuario', user.id) 
          .order('fecha', { ascending: false });

        if (error) throw error;
        setReparaciones(data || []);
      }
    } catch (error) {
      console.error("Error al cargar historial:", error.message);
    } finally {
      setCargando(false);
    }
  };

  const getIconoEstado = (estado) => {
    // Normalizamos a mayúsculas para evitar errores de coincidencia
    switch (estado?.toUpperCase()) {
      case 'PENDIENTE': return <FaClock color="#f39c12" />;
      case 'EN PROCESO': return <FaTools color="#38bdf8" />;
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
        <p>Consulta el estado de tus citas y las piezas sustituidas en tu vehículo.</p>
      </motion.div>

      <div className="historial-grid">
        <AnimatePresence mode="wait">
          {cargando ? (
            <motion.p 
              key="loading"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="status-msg"
            >
              Consultando base de datos...
            </motion.p>
          ) : reparaciones.length === 0 ? (
            <motion.div 
              key="empty"
              className="sin-datos" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p>No tienes ninguna reparación registrada todavía.</p>
            </motion.div>
          ) : (
            reparaciones.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
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
                  <h2>{item.marca} {item.modelo}</h2>
                  <p className="reparacion-desc"><strong>Motivo:</strong> {item.reparacion}</p>
                  
                  <div className="piezas-box">
                    <span className="piezas-label">Piezas utilizadas:</span>
                    <p>{item.piezas || "El técnico aún no ha desglosado las piezas."}</p>
                  </div>
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