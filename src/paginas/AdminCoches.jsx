import React, { useState } from 'react';
import FormularioPublicarCoche from '../componentes/FormularioPublicarCoche';
import GestionarCochesVenta from '../componentes/GestionarCochesVenta';
import '../styles/AdminCoches.css';

const PaginaVentaCoches = () => {
    const [seccion, setSeccion] = useState('publicar');
    const [count, setCount] = useState(0);
    const [cocheEditar, setCocheEditar] = useState(null);

    const activarEdicion = (coche) => {
        setCocheEditar(coche);
        setSeccion('publicar'); 
    };

    const confirmarGuardado = () => {
        setCount(c => c + 1);
        setCocheEditar(null); 
        setSeccion('lista');  
    };

    return (
        <div className="admin-coches-contenedor">
            <div className="admin-tabs">
                <button onClick={() => { setSeccion('publicar'); setCocheEditar(null); }} className={seccion === 'publicar' ? 'active' : ''}>
                    {cocheEditar ? '📝 Editando' : 'Añadir Coche'}
                </button>
                <button onClick={() => setSeccion('lista')} className={seccion === 'lista' ? 'active' : ''}>
                    Ver y Borrar Stock
                </button>
            </div>

            <div className="contenido-admin">
                {seccion === 'publicar' ? (
                    <FormularioPublicarCoche 
                        onUpdate={confirmarGuardado} 
                        datosEdicion={cocheEditar} 
                    />
                ) : (
                    <GestionarCochesVenta 
                        refreshing={count} 
                        onEdit={activarEdicion} 
                    />
                )}
            </div>
        </div>
    );
};

export default PaginaVentaCoches;