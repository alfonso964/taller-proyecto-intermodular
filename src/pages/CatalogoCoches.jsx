import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import TarjetaCoche from '../componentes/TarjetaCoche';
import FiltrosCoches from '../componentes/FiltroCoches';
import Footer from '../componentes/Footer'; // Importación del componente Footer
import '../styles/CatalogoCoches.css';

const CatalogoCoches = () => {
    const [coches, setCoches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtros, setFiltros] = useState({
        busqueda: '',
        combustible: '',
        precioMax: 100000,
        potenciaMin: 0
    });

    const fetchCoches = useCallback(async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('coches_venta')
                .select('*')
                .order('created_at', { ascending: false });


            if (filtros.busqueda) {
                query = query.or(`marca.ilike.%${filtros.busqueda}%,modelo.ilike.%${filtros.busqueda}%`);
            }

            if (filtros.combustible) {
                query = query.eq('combustible', filtros.combustible);
            }

            if (filtros.precioMax) {
                query = query.lte('precio', filtros.precioMax);
            }

            if (filtros.potenciaMin > 0) {
                query = query.gte('cv', filtros.potenciaMin);
            }

            const { data, error } = await query;

            if (error) throw error;
            setCoches(data);
        } catch (error) {
            console.error("Error cargando coches:", error.message);
        } finally {
            setLoading(false);
        }
    }, [filtros]);

    useEffect(() => {
        fetchCoches();
    }, [fetchCoches]);

    return (
        <div className="catalogo-container">
            <header className="catalogo-header">
                <h1>Vehículos en Venta</h1>
                <p>Encuentra tu próximo coche revisado y garantizado</p>
            </header>

            <FiltrosCoches alFiltrar={(nuevosFiltros) => setFiltros(nuevosFiltros)} />

            <div className="coches-grid">
                {loading ? (
                    <div className="loading">Actualizando resultados...</div>
                ) : coches.length > 0 ? (
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
                    <p className="no-coches">No se han encontrado vehículos que coincidan con tu búsqueda.</p>
                )}
            </div>

        </div>
    );
};

export default CatalogoCoches;