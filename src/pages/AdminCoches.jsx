import React, { useState } from 'react';
import FormularioPublicarCoche from '../componentes/FormularioPublicarCoche';
import GestionarCochesVenta from '../componentes/GestionarCochesVenta';
import '../styles/AdminCoches.css';

const PaginaVentaCoches = () => {
    const [seccion, setSeccion] = useState('publicar');
    const [count, setCount] = useState(0);
    // NUEVO: Estado para el coche que estamos editando
    const [cocheAEditar, setCocheAEditar] = useState(null);

    // NUEVO: Función para activar la edición
    const activarEdicion = (coche) => {
        setCocheAEditar(coche);
        setSeccion('publicar'); // Saltamos al formulario automáticamente
    };

    const handleSuccess = () => {
        setCount(c => c + 1);
        setCocheAEditar(null); // Limpiamos después de guardar
        setSeccion('lista');   // Volvemos a la lista
    };

    return (
        <div className="admin-coches-container">
            <div className="admin-tabs">
                <button onClick={() => { setSeccion('publicar'); setCocheAEditar(null); }} className={seccion === 'publicar' ? 'active' : ''}>
                    {cocheAEditar ? '📝 Editando' : 'Añadir Coche'}
                </button>
                <button onClick={() => setSeccion('lista')} className={seccion === 'lista' ? 'active' : ''}>
                    Ver y Borrar Stock
                </button>
            </div>

            <div className="admin-content">
                {seccion === 'publicar' ? (
                    <FormularioPublicarCoche 
                        onUpdate={handleSuccess} 
                        datosEdicion={cocheAEditar} // Pasamos los datos al formulario
                    />
                ) : (
                    <GestionarCochesVenta 
                        refreshing={count} 
                        onEdit={activarEdicion} // Pasamos la función a la lista
                    />
                )}
            </div>
        </div>
    );
};

export default PaginaVentaCoches;