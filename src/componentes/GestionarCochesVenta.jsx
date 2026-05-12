/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const GestionarCochesVenta = ({ refreshing, onEdit }) => {
    const [coches, setCoches] = useState([]);
    const [cargar, setCargar] = useState(true);

    const fetchCoches = async () => {
        setCargar(true);
        const { data, error } = await supabase
            .from('coches_venta')
            .select('*')
            .order('created_at', { ascending: false });
        if (!error) setCoches(data);
        setCargar(false);
    };

    useEffect(() => {
        fetchCoches();
    }, [refreshing]);

    const eliminarCoche = async (id, marca, modelo) => {
        if (window.confirm(`¿Estás seguro de eliminar el ${marca} ${modelo}?`)) {
            const { error } = await supabase.from('coches_venta').delete().eq('id', id);
            if (!error) setCoches(coches.filter(c => c.id !== id));
        }
    };

    const editarCoche = (coche) => {
        if (onEdit) {
            onEdit(coche);
        }
    };

    if (cargar) return <div className="loading-admin">Cargando inventario profesional...</div>;

    return (
        <div className="lista-gestion-admin">
            <h3 className="titulo-seccion">Inventario de Vehículos</h3>
            <div className="tabla-gestion">
                <div className="tabla-header">
                    <span>Vehículo</span>
                    <span>Precio</span>
                    <span>Acciones</span>
                </div>
                {coches.map(c => (
                    <div key={c.id} className="fila-coche-gestion">
                        <div className="info-principal">
                            <img src={c.imagenes?.[0]} alt={c.modelo} className="img-mini" />
                            <div className="textos">
                                <strong>{c.marca} {c.modelo}</strong>
                                <small>{c.kms.toLocaleString()} km • {c.combustible}</small>
                            </div>
                        </div>
                        <div className="precio-admin">
                            {c.precio.toLocaleString()} €
                        </div>
                        <div className="acciones-admin">
                            <button onClick={() => editarCoche(c)} className="btn-editar">Editar</button>
                            <button onClick={() => eliminarCoche(c.id, c.marca, c.modelo)} className="btn-borrar">Eliminar</button>
                        </div>
                    </div>
                ))}
                {coches.length === 0 && <p className="vacio">No hay vehículos en stock.</p>}
            </div>
        </div>
    );
};

export default GestionarCochesVenta;