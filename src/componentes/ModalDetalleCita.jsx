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
  
  // ESTADOS PARA EL CÁLCULO (Ahora precioHora también es un estado)
  const [horasReales, setHorasReales] = useState(cita?.horas_reales || 0);
  const [precioHora, setPrecioHora] = useState(40); // Tarifa base editable

  useEffect(() => {
    if (isOpen && cita) {
      cargarDatos();
      setHorasReales(cita.horas_reales || 0);
      // Si la cita ya tenía un precio de mano de obra y horas, recuperamos la tarifa aplicada
      if (cita.precio_mano_obra > 0 && cita.horas_reales > 0) {
        setPrecioHora(cita.precio_mano_obra / cita.horas_reales);
      } else {
        setPrecioHora(40); // Por defecto
      }
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

  const finalizarGuardadoEconomico = async () => {
    setCargando(true);
    try {
      // 1. Calcular total de piezas
      const totalPrecioPiezas = piezasUsadas.reduce((acc, p) => 
        acc + (p.cantidad * p.piezas.precio), 0
      );

      // 2. Calcular mano de obra con la tarifa actual del input
      const manoObraCalculada = Number(horasReales) * Number(precioHora);
      
      // 3. Calcular gran total
      const granTotal = manoObraCalculada + totalPrecioPiezas;

      // 4. Actualizar Supabase
      const { error } = await supabase
        .from('citas')
        .update({
          horas_reales: Number(horasReales),
          precio_mano_obra: manoObraCalculada,
          precio_piezas: totalPrecioPiezas,
          precio_total: granTotal,
          estado: 'FINALIZADA'
        })
        .eq('id', cita.id);

      if (error) throw error;

      alert("Facturación actualizada con éxito");
      if (onUpdate) onUpdate();
      onClose();

    } catch (error) {
      alert("Error al guardar: " + error.message);
    } finally {
      setCargando(false);
    }
  };

  const gestionarAñadirPieza = async () => {
    if (!piezaSeleccionada || cantidad <= 0) return alert("Selecciona pieza y cantidad válida");
    
    const piezaInfo = piezasDisponibles.find(p => p.id === parseInt(piezaSeleccionada));
    if (cantidad > piezaInfo.stock) return alert(`Solo quedan ${piezaInfo.stock} unidades.`);

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
      await cargarDatos();
      if (onUpdate) onUpdate(); 

    } catch (error) {
      alert("Error al añadir pieza: " + error.message);
    } finally {
      setCargando(false);
    }
  };

  const piezasFiltradas = piezasDisponibles.filter(p => 
    p.nombre.toLowerCase().includes(filtroPieza.toLowerCase()) || 
    p.referencia?.toLowerCase().includes(filtroPieza.toLowerCase())
  );

  if (!isOpen || !cita) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-contenido detalle-cita">
        <button className="cerrar-modal" onClick={onClose}>&times;</button>
        
        <h2>🛠️ Gestión de Costes: {cita.marca} {cita.modelo}</h2>
        
        {/* SECCIÓN DE MANO DE OBRA CON TARIFA VARIABLE */}
        <div className="seccion-mano-obra">
          <h3>⏱️ Mano de Obra</h3>
          <div className="admin-grid-precios">
            <div className="input-field">
              <label>Horas:</label>
              <input 
                type="number" 
                step="0.5"
                value={horasReales}
                onChange={(e) => setHorasReales(e.target.value)}
                placeholder="0.0"
              />
            </div>
            <div className="input-field">
              <label>Precio/Hora (€):</label>
              <input 
                type="number" 
                value={precioHora}
                onChange={(e) => setPrecioHora(e.target.value)}
                placeholder="40"
              />
            </div>
            <div className="subtotal-display">
              <span>Subtotal Mano de Obra:</span>
              <strong>{(Number(horasReales) * Number(precioHora)).toFixed(2)}€</strong>
            </div>
          </div>
        </div>

        <div className="seccion-añadir-pieza">
          <h3>➕ Añadir Pieza</h3>
          <div className="formulario-añadir-pieza">
            <div className="buscador-wrapper">
                <input 
                    type="text"
                    placeholder="🔍 Buscar pieza..."
                    value={filtroPieza}
                    onChange={(e) => setFiltroPieza(e.target.value)}
                    className="input-busqueda-micro"
                />
                <select 
                    value={piezaSeleccionada} 
                    onChange={e => setPiezaSeleccionada(e.target.value)}
                    className="select-pieza"
                >
                    <option value="">-- Selecciona --</option>
                    {piezasFiltradas.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.nombre} - {p.precio}€
                        </option>
                    ))}
                </select>
            </div>
            
            <input type="number" min="1" value={cantidad} onChange={e => setCantidad(e.target.value)} className="input-cantidad" />
            <button onClick={gestionarAñadirPieza} className="btn-accion-primario" disabled={cargando}>
                {cargando ? '...' : 'Añadir'}
            </button>
          </div>
        </div>

        <div className="seccion-piezas-usadas">
          <h3>📦 Desglose de Materiales</h3>
          <div className="tabla-scroll-micro">
            <table className="tabla-micro">
              <thead>
                <tr>
                  <th>Pieza</th>
                  <th>Cant.</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {piezasUsadas.length > 0 ? piezasUsadas.map(pUsada => (
                  <tr key={pUsada.id}>
                    <td>{pUsada.piezas.nombre}</td>
                    <td>{pUsada.cantidad}</td>
                    <td className="txt-total">{(pUsada.cantidad * pUsada.piezas.precio).toFixed(2)}€</td>
                  </tr>
                )) : (
                    <tr><td colSpan="3" className="txt-vacio">Sin piezas.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="modal-footer-admin">
          <button 
            className="btn-finalizar-reparacion" 
            onClick={finalizarGuardadoEconomico}
            disabled={cargando}
          >
            {cargando ? 'Guardando...' : '💾 Guardar y Finalizar Facturación'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalleCita;