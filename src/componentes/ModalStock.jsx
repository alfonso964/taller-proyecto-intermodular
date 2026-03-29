/* eslint-disable react-hooks/immutability */
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/ModalStock.css';

const ModalStock = ({ isOpen, onClose, onUpdate }) => {
  const [piezas, setPiezas] = useState([]);
  const [nuevaPieza, setNuevaPieza] = useState({ nombre: '', referencia: '', stock: '', precio: '' });

  useEffect(() => {
    if (isOpen) cargarPiezas();
  }, [isOpen]);

  const cargarPiezas = async () => {
    const { data } = await supabase.from('piezas').select('*').order('nombre');
    setPiezas(data || []);
  };

  const agregarPieza = async () => {
    if (!nuevaPieza.nombre) return alert("Ponle un nombre a la pieza");
    
    // Preparamos los datos asegurando que stock y precio sean números
    const piezaParaInsertar = {
        nombre: nuevaPieza.nombre,
        referencia: nuevaPieza.referencia || '',
        stock: parseInt(nuevaPieza.stock) || 0,
        precio: parseFloat(nuevaPieza.precio) || 0,
        avisoStock: 5 // Valor por defecto necesario para tu tabla
    };

    const { error } = await supabase.from('piezas').insert([piezaParaInsertar]);
    
    if (!error) {
      setNuevaPieza({ nombre: '', referencia: '', stock: '', precio: '' });
      cargarPiezas();
      if (onUpdate) onUpdate(); 
    } else {
      console.error("Error Supabase:", error);
      alert("Error al guardar la pieza: " + error.message);
    }
  };

  const actualizarStock = async (id, nuevoStock) => {
    const { error } = await supabase
      .from('piezas')
      .update({ stock: parseInt(nuevoStock) || 0 })
      .eq('id', id);

    if (!error) {
      cargarPiezas();
      if (onUpdate) onUpdate();
    } else {
      alert("Error al actualizar stock");
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
            placeholder="Pieza (ej: Amortiguador)" 
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
            placeholder="Precio (€)" 
            value={nuevaPieza.precio} 
            onChange={e => setNuevaPieza({...nuevaPieza, precio: e.target.value})} 
          />
          <button className="btn-añadir-pieza" onClick={agregarPieza}>Añadir</button>
        </div>

        <div className="tabla-scroll-contenedor">
            <table className="tabla-inventario">
              <thead>
                <tr>
                  <th>Nombre Pieza</th>
                  <th>Referencia</th>
                  <th>Stock</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {piezas.length > 0 ? piezas.map(pieza => (
                  <tr key={pieza.id}>
                    <td className="celda-nombre">{pieza.nombre}</td>
                    <td className="celda-referencia">{pieza.referencia || 'N/A'}</td>
                    <td>
                      <input 
                        type="number" 
                        defaultValue={pieza.stock} 
                        onBlur={(e) => actualizarStock(pieza.id, e.target.value)}
                      />
                    </td>
                    <td className="celda-precio">{pieza.precio}€</td>
                    <td>
                      <button className="btn-eliminar" onClick={() => eliminarPieza(pieza.id)}>Borrar</button>
                    </td>
                  </tr>
                )) : (
                    <tr>
                        <td colSpan="5" className="tabla-vacia-msg">
                            No hay piezas registradas aún.
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