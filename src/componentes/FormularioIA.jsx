/* eslint-disable no-unused-vars */
import { useState } from 'react';
import axios from 'axios'; 
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaRobot } from 'react-icons/fa'; 
import ModalCalendario from './ModalCalendario'; 
import { supabase } from '../supabaseClient';
import '../styles/FormularioIA.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function FormularioIA() {
  // Estado actualizado con matricula y horas_reales
  const [vehiculo, setVehiculo] = useState({ 
    marca: '', 
    modelo: '', 
    anio: '', 
    kilometraje: '', 
    reparacion: '',
    matricula: '',
    horas_reales: '' // Se inicializa vacío para el input
  });
  
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
        mensajeAdicional: "Por favor, si sugieres una cita para hoy, verifica que la hora sea posterior a la actual. Además, intenta estimar el tiempo de trabajo necesario."
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
      
      // Lógica de negocio: 40€ por hora
      const horas = parseFloat(vehiculo.horas_reales) || 0;
      const manoDeObra = horas * 40;

      const { error } = await supabase
        .from('citas')
        .insert([
          { 
            marca: vehiculo.marca,
            modelo: vehiculo.modelo,
            anio: vehiculo.anio,
            kilometraje: vehiculo.kilometraje,
            reparacion: vehiculo.reparacion,
            matricula: vehiculo.matricula.toUpperCase(), // Guardamos siempre en mayúsculas
            horas_reales: horas,
            precio_mano_obra: manoDeObra,
            precio_total: manoDeObra, // Por defecto al crearla, el total es la mano de obra
            fecha: fechaFinal,
            id_usuario: user.id, 
            contacto_invitado: user.email,
            estado: 'PENDIENTE' 
          }
        ]);

      if (error) throw error;

      alert("✅ Cita confirmada correctamente en el sistema.");
      // Limpiamos todo el estado
      setVehiculo({ marca: '', modelo: '', anio: '', kilometraje: '', reparacion: '', matricula: '', horas_reales: '' });
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
            <li>✅ Diagnóstico preciso por matrícula.</li>
            <li>✅ Estimación de tiempos y costes.</li>
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
              <input name="matricula" placeholder="Matrícula" value={vehiculo.matricula} onChange={manejarCambioInput} required />
              <input name="marca" placeholder="Marca" value={vehiculo.marca} onChange={manejarCambioInput} required />
            </div>
            <div className="ia-fila-input">
              <input name="modelo" placeholder="Modelo" value={vehiculo.modelo} onChange={manejarCambioInput} required />
              <input name="anio" placeholder="Año" value={vehiculo.anio} onChange={manejarCambioInput} required />
            </div>
            <div className="ia-fila-input">
              <input name="kilometraje" placeholder="Kilometraje" value={vehiculo.kilometraje} onChange={manejarCambioInput} required />
              <input name="horas_reales" type="number" step="0.5" placeholder="Horas estimadas" value={vehiculo.horas_reales} onChange={manejarCambioInput} />
            </div>
            <textarea name="reparacion" placeholder="Describe la reparación" value={vehiculo.reparacion} onChange={manejarCambioInput} required />
            
            <button type="submit" disabled={cargando} className="ia-boton-enviar">
              {cargando ? 'Analizando...' : 'Consultar a la IA'}
            </button>
          </form>

          <AnimatePresence>
            {cargando && (
              <motion.div 
                className="ia-contenedor-carga-moderno"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                style={{ marginTop: '20px', textAlign: 'center' }}
              >
                <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#38bdf8' }}>
                  <FaRobot className="ia-icono-pulso" />
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    style={{ fontWeight: '500', fontSize: '0.9rem' }}
                  >
                    Procesando diagnóstico técnico...
                  </motion.span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    style={{ 
                      width: '40%', 
                      height: '100%', 
                      background: 'linear-gradient(90deg, transparent, #38bdf8, transparent)', 
                      position: 'absolute' 
                    }}
                  />
                </div>
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