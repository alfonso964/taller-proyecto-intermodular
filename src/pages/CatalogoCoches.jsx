import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import TarjetaCoche from '../componentes/TarjetaCoche';
import FiltrosCoches from '../componentes/FiltroCoches';
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
        <div className="catalogo-wrapper">
            {/* ESTO OCUPA EL 100% DE LA PANTALLA */}
            <section className="hero-catalogo">
                <div className="hero-overlay">
                    <div className="hero-inner-content">
                        <span className="badge-superior">Inventario Taller Motors</span>
                        <h1>Tu próximo coche te espera</h1>
                        <p>
                            Vehículos de ocasión rigurosamente inspeccionados en nuestro taller. 
                            Garantizamos transparencia, calidad y el mejor servicio post-venta.
                        </p>
                        <div className="hero-trust-badges">
                            <div className="badge-item"><span>🛡️</span> 12 meses de garantía</div>
                            <div className="badge-item"><span>🔄</span> Aceptamos tu coche</div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="catalogo-container">
                <main className="catalogo-main">
                    <div className="catalogo-sidebar">
                        <FiltrosCoches alFiltrar={(nuevosFiltros) => setFiltros(nuevosFiltros)} />
                    </div>

                    <div className="coches-content">

                        <div className="coches-grid">
                            {loading ? (
                                <div className="loading-spinner">
                                    <div className="spinner"></div>
                                    <p>Actualizando stock...</p>
                                </div>
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
                                <div className="no-results-card">
                                    <h3>Sin resultados</h3>
                                    <p>No hay coches con esos filtros.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CatalogoCoches;