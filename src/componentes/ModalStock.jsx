/* eslint-disable react-hooks/immutability */
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/ModalStock.css';

const ModalStock = ({ isOpen, onClose, onUpdate }) => {
  const [piezas, setPiezas] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [nuevaPieza, setNuevaPieza] = useState({ nombre: '', referencia: '', stock: '', precio: '', precio_coste: '' });

  useEffect(() => {
    if (isOpen) cargarPiezas();
  }, [isOpen]);

  const cargarPiezas = async () => {
    const { data } = await supabase.from('piezas').select('*').order('nombre');
    setPiezas(data || []);
  };

  const agregarPieza = async () => {
    if (!nuevaPieza.nombre) return alert("Ponle un nombre a la pieza");
    
    const piezaParaInsertar = {
        nombre: nuevaPieza.nombre,
        referencia: nuevaPieza.referencia || '',
        stock: parseInt(nuevaPieza.stock) || 0,
        precio: parseFloat(nuevaPieza.precio) || 0,
        precio_coste: parseFloat(nuevaPieza.precio_coste) || 0,
        avisoStock: 5 
    };

    const { error } = await supabase.from('piezas').insert([piezaParaInsertar]);
    
    if (!error) {
      setNuevaPieza({ nombre: '', referencia: '', stock: '', precio: '', precio_coste: '' });
      cargarPiezas();
      if (onUpdate) onUpdate(); 
    } else {
      alert("Error al guardar la pieza: " + error.message);
    }
  };

  // --- FUNCIÓN DE ACTUALIZACIÓN GENÉRICA ---
  const actualizarCampoPieza = async (id, campo, valor) => {
    // Formateamos el valor según el tipo de columna
    let valorFormateado = valor;
    if (campo === 'stock') valorFormateado = parseInt(valor) || 0;
    if (campo === 'precio' || campo === 'precio_coste') valorFormateado = parseFloat(valor) || 0;

    const { error } = await supabase
      .from('piezas')
      .update({ [campo]: valorFormateado })
      .eq('id', id);

    if (!error) {
      // Opcional: No recargamos toda la lista para evitar parpadeos, 
      // pero avisamos al padre para que actualice gráficas/alertas.
      if (onUpdate) onUpdate();
    } else {
      alert("Error al actualizar: " + error.message);
      cargarPiezas(); // Recargamos para revertir el cambio visual fallido
    }
  };

  const eliminarPieza = async (id) => {
    if (window.confirm("¿Eliminar esta pieza del inventario?")) {
      const { error } = await supabase.from('piezas').delete().eq('id', id);
      if (!error) {
        cargarPiezas();
        if (onUpdate) onUpdate();
      } else {
        alert("Error al eliminar la pieza");
      }
    }
  };

  const piezasFiltradas = piezas.filter(p => 
    p.nombre.toLowerCase().includes(filtro.toLowerCase()) || 
    p.referencia.toLowerCase().includes(filtro.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <button className="cerrar-modal" onClick={onClose}>&times;</button>
        
        <h2 className="modal-titulo-inventario">
            📦 Gestión de Inventario
        </h2>

        <div className="formulario-pieza">
          <input 
            type="text" 
            placeholder="Pieza (ej: Batería)" 
            value={nuevaPieza.nombre} 
            onChange={e => setNuevaPieza({...nuevaPieza, nombre: e.target.value})} 
          />
          <input 
            type="text" 
            placeholder="Ref/SKU" 
            value={nuevaPieza.referencia} 
            onChange={e => setNuevaPieza({...nuevaPieza, referencia: e.target.value})} 
          />
          <input 
            type="number" 
            placeholder="Stock" 
            value={nuevaPieza.stock} 
            onChange={e => setNuevaPieza({...nuevaPieza, stock: e.target.value})} 
          />
          <input 
            type="number" 
            placeholder="Coste (€)" 
            value={nuevaPieza.precio_coste} 
            onChange={e => setNuevaPieza({...nuevaPieza, precio_coste: e.target.value})} 
          />
          <input 
            type="number" 
            placeholder="Venta (€)" 
            value={nuevaPieza.precio} 
            onChange={e => setNuevaPieza({...nuevaPieza, precio: e.target.value})} 
          />
          <button className="btn-añadir-pieza" onClick={agregarPieza}>Añadir</button>
        </div>

        <input 
          type="text" 
          className="buscador-inventario" 
          placeholder="🔍 Buscar pieza por nombre o referencia..." 
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

        <div className="tabla-scroll-contenedor">
            <table className="tabla-inventario">
              <thead>
                <tr>
                  <th>Nombre Pieza</th>
                  <th>Referencia</th>
                  <th>Stock</th>
                  <th>Coste (€)</th>
                  <th>Venta (€)</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {piezasFiltradas.length > 0 ? piezasFiltradas.map(pieza => (
                  <tr key={pieza.id}>
                    <td>
                      <input 
                        type="text"
                        className="input-celda-edicion"
                        defaultValue={pieza.nombre}
                        onBlur={(e) => actualizarCampoPieza(pieza.id, 'nombre', e.target.value)}
                      />
                    </td>
                    <td>
                      <input 
                        type="text"
                        className="input-celda-edicion"
                        defaultValue={pieza.referencia}
                        onBlur={(e) => actualizarCampoPieza(pieza.id, 'referencia', e.target.value)}
                      />
                    </td>
                    <td>
                      <input 
                        type="number" 
                        className="input-celda-edicion stock-input"
                        defaultValue={pieza.stock} 
                        onBlur={(e) => actualizarCampoPieza(pieza.id, 'stock', e.target.value)}
                      />
                    </td>
                    <td>
                      <input 
                        type="number" 
                        className="input-celda-edicion"
                        defaultValue={pieza.precio_coste} 
                        onBlur={(e) => actualizarCampoPieza(pieza.id, 'precio_coste', e.target.value)}
                      />
                    </td>
                    <td>
                      <input 
                        type="number" 
                        className="input-celda-edicion venta-input"
                        defaultValue={pieza.precio} 
                        onBlur={(e) => actualizarCampoPieza(pieza.id, 'precio', e.target.value)}
                      />
                    </td>
                    <td>
                      <button className="btn-eliminar" onClick={() => eliminarPieza(pieza.id)}>Borrar</button>
                    </td>
                  </tr>
                )) : (
                    <tr>
                        <td colSpan="6" className="tabla-vacia-msg">
                            {filtro ? "No se encontraron piezas." : "No hay piezas registradas."}
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default ModalStock;