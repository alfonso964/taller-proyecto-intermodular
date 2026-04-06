/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/ModalDetalleCita.css';

const ModalDetalleCita = ({ isOpen, onClose, cita, onUpdate }) => {
  const [piezasDisponibles, setPiezasDisponibles] = useState([]);
  const [piezasUsadas, setPiezasUsadas] = useState([]);
  const [piezaSeleccionada, setPiezaSeleccionada] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [filtroPieza, setFiltroPieza] = useState('');

  useEffect(() => {
    if (isOpen && cita) {
      cargarDatos();
    }
  }, [isOpen, cita]);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const { data: dataPiezas } = await supabase
        .from('piezas')
        .select('id, nombre, referencia, stock, precio')
        .gt('stock', 0) 
        .order('nombre');
      setPiezasDisponibles(dataPiezas || []);

      const { data: dataUsadas, error: errUsadas } = await supabase
        .from('cita_piezas')
        .select(`
          id,
          cantidad,
          piezas ( nombre, referencia, precio )
        `)
        .eq('id_cita', cita.id);

      if (errUsadas) throw errUsadas;
      setPiezasUsadas(dataUsadas || []);

    } catch (error) {
      console.error("Error cargando detalles:", error.message);
    } finally {
      setCargando(false);
    }
  };

  const gestionarAñadirPieza = async () => {
    if (!piezaSeleccionada || cantidad <= 0) return alert("Selecciona pieza y cantidad válida");
    
    const piezaInfo = piezasDisponibles.find(p => p.id === parseInt(piezaSeleccionada));
    if (cantidad > piezaInfo.stock) return alert(`Solo quedan ${piezaInfo.stock} unidades de esta pieza.`);

    setCargando(true);
    try {
      const { error } = await supabase.rpc('añadir_pieza_a_cita', {
        p_id_cita: cita.id,
        p_id_pieza: parseInt(piezaSeleccionada),
        p_cantidad: parseInt(cantidad)
      });

      if (error) throw error;

      setPiezaSeleccionada('');
      setFiltroPieza(''); 
      setCantidad(1);
      cargarDatos();
      if (onUpdate) onUpdate(); 

    } catch (error) {
      alert("Error al añadir pieza: " + error.message);
    } finally {
      setCargando(false);
    }
  };

  // Filtrado dinámico: Si no hay filtro, muestra todo. Si hay texto, filtra.
  const piezasFiltradas = piezasDisponibles.filter(p => 
    p.nombre.toLowerCase().includes(filtroPieza.toLowerCase()) || 
    p.referencia?.toLowerCase().includes(filtroPieza.toLowerCase())
  );

  if (!isOpen || !cita) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-contenido detalle-cita">
        <button className="cerrar-modal" onClick={onClose}>&times;</button>
        
        <h2>🛠️ Detalle de Reparación: {cita.marca} {cita.modelo}</h2>
        <p className="subtitulo-cita">Cliente: {cita.perfiles?.email || 'Invitado'} | Fecha: {new Date(cita.fecha).toLocaleDateString()}</p>
        
        <div className="seccion-añadir-pieza">
          <h3>➕ Añadir Pieza Utilizada</h3>
          <div className="formulario-añadir-pieza">
            <div className="buscador-wrapper">
                <input 
                    type="text"
                    placeholder="🔍 Escribe para buscar pieza..."
                    value={filtroPieza}
                    onChange={(e) => setFiltroPieza(e.target.value)}
                    className="input-busqueda-micro"
                />
                <select 
                    value={piezaSeleccionada} 
                    onChange={e => setPiezaSeleccionada(e.target.value)}
                    className="select-pieza"
                >
                    <option value="">
                        {piezasFiltradas.length > 0 ? "-- Selecciona de la lista --" : "No hay coincidencias"}
                    </option>
                    {piezasFiltradas.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.nombre} ({p.referencia || 'sin ref'}) - Stock: {p.stock}
                        </option>
                    ))}
                </select>
            </div>
            
            <input 
              type="number" 
              min="1" 
              value={cantidad} 
              onChange={e => setCantidad(e.target.value)} 
              className="input-cantidad"
              placeholder="Cant."
            />
            <button 
                onClick={gestionarAñadirPieza} 
                className="btn-accion-primario"
                disabled={cargando}
            >
                {cargando ? '...' : 'Añadir'} {/* Cambiado de Vincular a Añadir */}
            </button>
          </div>
        </div>

        <div className="seccion-piezas-usadas">
          <h3>📦 Piezas Vinculadas a esta Reparación</h3>
          <div className="tabla-scroll-micro">
            <table className="tabla-micro">
              <thead>
                <tr>
                  <th>Pieza</th>
                  <th>Referencia</th>
                  <th>Cantidad</th>
                  <th>Precio Unit.</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {piezasUsadas.length > 0 ? piezasUsadas.map(pUsada => (
                  <tr key={pUsada.id}>
                    <td>{pUsada.piezas.nombre}</td>
                    <td>{pUsada.piezas.referencia || '-'}</td>
                    <td className="txt-destacado">{pUsada.cantidad}</td>
                    <td>{pUsada.piezas.precio}€</td>
                    <td className="txt-total">{(pUsada.cantidad * pUsada.piezas.precio).toFixed(2)}€</td>
                  </tr>
                )) : (
                    <tr><td colSpan="5" className="txt-vacio">No se han registrado piezas aún.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalleCita;