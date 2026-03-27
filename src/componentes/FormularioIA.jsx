/* eslint-disable no-unused-vars */
import { useState } from 'react';
import axios from 'axios'; 
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCarSide, FaCheckCircle } from 'react-icons/fa'; 
import ModalCalendario from './ModalCalendario'; 
import { supabase } from '../supabaseClient';
import '../styles/FormularioIA.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function FormularioIA() {
  const [vehiculo, setVehiculo] = useState({ 
    marca: '', modelo: '', anio: '', kilometraje: '', reparacion: '' });
  const [respuestaIA, setRespuestaIA] = useState('');
  const [fechaSugeridaIA, setFechaSugeridaIA] = useState(null); 
  const [cargando, setCargando] = useState(false);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);

  const abrirCalendario = () => setMostrarCalendario(true);
  const cerrarCalendario = () => setMostrarCalendario(false);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setVehiculo({ ...vehiculo, [name]: value });
  };

  const enviarADiagnostico = async (e) => {
    e.preventDefault();
    setCargando(true);
    setRespuestaIA('');

    const contextoTemporal = {
        ...vehiculo,
        fechaActual: new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' }),
        mensajeAdicional: "Por favor, si sugieres una cita para hoy, verifica que la hora sea posterior a la actual."
    };

    try {
      const res = await axios.post(`${API_URL}/api/agente-ia`, contextoTemporal);
      setRespuestaIA(res.data.respuesta);
      
      if (res.data.fechaSugerida) {
        setFechaSugeridaIA(res.data.fechaSugerida);
      } else {
        setFechaSugeridaIA(new Date().toISOString()); 
      }

    } catch (error) {
      setRespuestaIA("Error al conectar con el servidor de IA.");
    } finally {
      setCargando(false);
    }
  };

  const guardarCita = async (fechaElegida) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert("Debes estar logueado para pedir una cita.");
        return;
      }

      const fechaFinal = typeof fechaElegida === 'string' ? fechaElegida : fechaElegida.toISOString();
      
      const { error } = await supabase
        .from('citas')
        .insert([
          { 
            marca: vehiculo.marca,
            modelo: vehiculo.modelo,
            anio: vehiculo.anio,
            kilometraje: vehiculo.kilometraje,
            reparacion: vehiculo.reparacion,
            fecha: fechaFinal,
            id_usuario: user.id, 
            estado: 'Pendiente'
          }
        ]);

      if (error) throw error;

      alert("✅ Cita confirmada correctamente en el sistema.");
      setVehiculo({ marca: '', modelo: '', anio: '', kilometraje: '', reparacion: '' });
      setRespuestaIA('');
      setFechaSugeridaIA(null);
      cerrarCalendario();

    } catch (error) {
      console.error("Error al guardar la cita:", error);
      alert("❌ Error al guardar la cita: " + error.message);
    }
  };

  return (
    <div className="ia-pagina-contenedor">
      <div className="ia-layout-principal">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="ia-tarjeta-azul"
        >
          <h2>Diagnóstico Inteligente</h2>
          <p>Análisis en tiempo real basado en datos técnicos avanzados.</p>
          <ul className="ia-lista-beneficios">
            <li>✅ Diagnóstico preciso.</li>
            <li>✅ Estimación de tiempos.</li>
            <li>✅ Reserva inmediata.</li>
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="ia-panel-formulario"
        >
          <h1>Diagnóstico y Cita</h1>
          
          <form onSubmit={enviarADiagnostico} className="ia-formulario">
            <div className="ia-fila-input">
              <input name="marca" placeholder="Marca" value={vehiculo.marca} onChange={manejarCambioInput} required />
              <input name="modelo" placeholder="Modelo" value={vehiculo.modelo} onChange={manejarCambioInput} required />
            </div>
            <div className="ia-fila-input">
              <input name="anio" placeholder="Año" value={vehiculo.anio} onChange={manejarCambioInput} required />
              <input name="kilometraje" placeholder="Kilometraje" value={vehiculo.kilometraje} onChange={manejarCambioInput} required />
            </div>
            <textarea name="reparacion" placeholder="Describe la reparación" value={vehiculo.reparacion} onChange={manejarCambioInput} required />
            
            <button type="submit" disabled={cargando} className="ia-boton-enviar">
              {cargando ? 'Analizando vehículo...' : 'Consultar a la IA'}
            </button>
          </form>

          <AnimatePresence>
            {cargando && (
              <motion.div className="ia-contenedor-carga" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="ia-carretera">
                  <motion.div className="ia-coche-animado" animate={{ x: ["0%", "100%", "0%"] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                    <FaCarSide size={35} color="#38bdf8" />
                  </motion.div>
                </div>
                <p>Nuestra IA está pensando...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {respuestaIA && (
            <motion.div className="ia-respuesta-caja" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <ReactMarkdown>{respuestaIA}</ReactMarkdown>
              <div className="ia-acciones" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                
                <button 
                  className="ia-btn-confirmar-sugerida" 
                  style={{ width: '100%', backgroundColor: '#22c55e', color: 'white', padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold' }} 
                  onClick={() => guardarCita(fechaSugeridaIA)}
                >
                  <FaCheckCircle /> Confirmar cita sugerida
                </button>

                <button 
                  className="ia-btn-calendario" 
                  style={{ width: '100%', padding: '10px' }} 
                  onClick={abrirCalendario}
                >
                  📅 Seleccionar otra fecha (Calendario)
                </button>
              </div>
            </motion.div>
          )}

          <ModalCalendario 
            key={mostrarCalendario ? 'modal-open' : 'modal-closed'}
            estaAbierto={mostrarCalendario} 
            cerrarModal={cerrarCalendario} 
            alSeleccionarFecha={guardarCita} 
          />
        </motion.div>
      </div>
    </div>
  );
}

export default FormularioIA;