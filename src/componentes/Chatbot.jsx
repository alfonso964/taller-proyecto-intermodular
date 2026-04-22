/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/Chatbot.css';

const Chatbot = () => {
  const [estaAbierto, setEstaAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([
    { id: "1", texto: "¡Hola! 👋 Soy tu asistente de Taller. ¿En qué puedo ayudarte hoy?", emisor: "bot" }
  ]);
  const [pasoActual, setPasoActual] = useState("inicio"); 
  const [filtros, setFiltros] = useState({ combustible: '', kilometraje: '', precio: '' });
  const referenciaScroll = useRef(null);

  useEffect(() => {
    if (referenciaScroll.current) {
      referenciaScroll.current.scrollTop = referenciaScroll.current.scrollHeight;
    }
  }, [mensajes, pasoActual]);

  const agregarMensaje = (texto, emisor) => {
    const idUnico = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setMensajes(prev => [...prev, { id: idUnico, texto, emisor }]);
  };

  const manejarOpcionChat = async (valor, etiqueta, tipo) => {
    agregarMensaje(etiqueta, "usuario");

    if (tipo === "inicio") {
      if (valor === "buscar_coche") {
        setPasoActual("combustible");
        agregarMensaje("¡Genial! Busquemos tu coche ideal. ¿Qué combustible prefieres?", "bot");
      } else if (valor === "ver_servicios") {
        agregarMensaje("Ofrecemos mecánica integral, chapa, pintura y diagnosis. ¿Quieres que te reserve cita para una revisión?", "bot");
        setPasoActual("inicio");
      } else if (valor === "pedir_cita") {
        agregarMensaje("Puedes usar el botón de 'Reservar' en el menú superior para elegir día y hora rápidamente.", "bot");
        setPasoActual("inicio");
      }
    }

    if (tipo === "combustible") {
      setFiltros(prev => ({ ...prev, combustible: valor }));
      setPasoActual("kilometraje");
      agregarMensaje("Entendido. ¿Qué rango de kilometraje buscas?", "bot");
    }

    if (tipo === "kilometraje") {
      setFiltros(prev => ({ ...prev, kilometraje: valor }));
      setPasoActual("presupuesto");
      agregarMensaje("Ya casi estamos. ¿Cuál es tu presupuesto máximo?", "bot");
    }

    if (tipo === "presupuesto") {
      const filtrosFinales = { ...filtros, precio: valor };
      setFiltros(filtrosFinales);
      setPasoActual("buscando");
      agregarMensaje("Buscando en nuestro inventario...", "bot");
      
      consultarCoches(filtrosFinales);
    }
  };

  const consultarCoches = async (f) => {
    try {
      // 1. Pedimos todas las columnas, incluyendo las nuevas: cv y estado
      let query = supabase
        .from('coches_venta')
        .select('marca, modelo, precio, kms, combustible, año, cv, estado');

      if (f.combustible) {
        query = query.eq('combustible', f.combustible);
      }
      
      if (f.kilometraje && f.kilometraje !== "999999") {
        query = query.lte('kms', parseInt(f.kilometraje));
      }
      
      if (f.precio && f.precio !== "999999") {
        query = query.lte('precio', parseInt(f.precio));
      }

      const { data, error } = await query;
      
      if (error) throw error;

      setTimeout(() => {
        if (data && data.length > 0) {
          agregarMensaje(`¡He encontrado ${data.length} opción(es) para ti!`, "bot");

          // 2. Mapeamos cada coche con la información completa
          data.forEach(coche => {
            const detalleCoche = `🚗 ${coche.marca} ${coche.modelo}\n\n` +
                                 `🔹 Estado: ${coche.estado || 'Disponible'}\n` +
                                 `💰 Precio: ${coche.precio}€\n` +
                                 `⚡ Potencia: ${coche.cv || 'Consultar'} CV\n` +
                                 `🛣️ Kilómetros: ${coche.kms} km\n` +
                                 `⛽ Combustible: ${coche.combustible}\n` +
                                 `📅 Año: ${coche.año}`;
            
            agregarMensaje(detalleCoche, "bot");
          });

          agregarMensaje("¿Te gustaría ver más fotos en el catálogo o prefieres buscar algo distinto?", "bot");
        } else {
          agregarMensaje("No he encontrado coches con esos filtros exactos, pero puedes revisar el catálogo completo arriba.", "bot");
        }
        setPasoActual("inicio");
      }, 1000);

    } catch (error) {
      console.error("Error Supabase:", error);
      agregarMensaje("Lo siento, ha habido un error al consultar los detalles. Inténtalo de nuevo.", "bot");
      setPasoActual("inicio");
    }
  };

  return (
    <div className={`chatbot-contenedor ${estaAbierto ? 'activo' : ''}`}>
      {!estaAbierto && (
        <button className="chatbot-activador" onClick={() => setEstaAbierto(true)}>
          🤖
        </button>
      )}

      {estaAbierto && (
        <div className="chatbot-ventana">
          <div className="chatbot-cabecera">
            <div className="cabecera-info">
              <span className="dot-online"></span>
              <h4>Asistente Taller</h4>
            </div>
            <button className="btn-cerrar-mini" onClick={() => setEstaAbierto(false)}>✕</button>
          </div>
          
          <div className="chatbot-mensajes" ref={referenciaScroll}>
            {mensajes.map(msg => (
              <div key={msg.id} className={`contenedor-burbuja ${msg.emisor}`}>
                {msg.emisor === "bot" && <div className="avatar-bot">🛠️</div>}
                <div className={`burbuja-mensaje ${msg.emisor}`} style={{ whiteSpace: 'pre-wrap' }}>
                  {msg.texto}
                </div>
              </div>
            ))}
            
            <div className="contenedor-opciones">
              {pasoActual === "inicio" && (
                <>
                  <button className="boton-opcion" onClick={() => manejarOpcionChat("buscar_coche", "🔍 Buscar un coche", "inicio")}>🔍 Buscar un coche</button>
                  <button className="boton-opcion" onClick={() => manejarOpcionChat("ver_servicios", "🛠️ Ver servicios", "inicio")}>🛠️ Ver servicios</button>
                  <button className="boton-opcion" onClick={() => manejarOpcionChat("pedir_cita", "📅 Pedir cita", "inicio")}>📅 Pedir cita</button>
                </>
              )}

              {pasoActual === "combustible" && (
                <>
                  <button className="boton-opcion" onClick={() => manejarOpcionChat("Gasolina", "⛽ Gasolina", "combustible")}>Gasolina</button>
                  <button className="boton-opcion" onClick={() => manejarOpcionChat("Diésel", "⛽ Diésel", "combustible")}>Diésel</button>
                  <button className="boton-opcion" onClick={() => manejarOpcionChat("Híbrido", "⚡ Híbrido/Eléctrico", "combustible")}>Híbrido/Eléctrico</button>
                </>
              )}

              {pasoActual === "kilometraje" && (
                <>
                  <button className="boton-opcion" onClick={() => manejarOpcionChat("50000", "📍 < 50.000 km", "kilometraje")}>Menos de 50.000 km</button>
                  <button className="boton-opcion" onClick={() => manejarOpcionChat("100000", "🛣️ < 100.000 km", "kilometraje")}>Hasta 100.000 km</button>
                  <button className="boton-opcion" onClick={() => manejarOpcionChat("999999", "🌍 Sin límite", "kilometraje")}>Sin límite</button>
                </>
              )}

              {pasoActual === "presupuesto" && (
                <>
                  <button className="boton-opcion" onClick={() => manejarOpcionChat("15000", "💰 < 15.000€", "presupuesto")}>Hasta 15.000€</button>
                  <button className="boton-opcion" onClick={() => manejarOpcionChat("30000", "💸 < 30.000€", "presupuesto")}>Hasta 30.000€</button>
                  <button className="boton-opcion" onClick={() => manejarOpcionChat("999999", "💎 Sin límite", "presupuesto")}>Sin límite</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;