import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import TarjetaCoche from '../componentes/TarjetaCoche';
import '../styles/CatalogoCoches.css'; // Crea este archivo para el grid

const CatalogoCoches = () => {
    const [coches, setCoches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCoches = async () => {
            try {
                const { data, error } = await supabase
                    .from('coches_venta')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setCoches(data);
            } catch (error) {
                console.error("Error cargando coches:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCoches();
    }, []);

    if (loading) return <div className="loading">Cargando catálogo...</div>;

    return (
        <div className="catalogo-container">
            <header className="catalogo-header">
                <h1>Vehículos en Venta</h1>
                <p>Encuentra tu próximo coche revisado y garantizado</p>
            </header>

            <div className="coches-grid">
                {coches.length > 0 ? (
                    coches.map(coche => (
                        <TarjetaCoche 
                            key={coche.id} 
                            coche={{
                                ...coche,
                                imagen: coche.imagenes && coche.imagenes[0] 
                            }} 
                        />
                    ))
                ) : (
                    <p className="no-coches">No hay vehículos disponibles en este momento.</p>
                )}
            </div>
        </div>
    );
};

export default CatalogoCoches;