import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import TarjetaCoche from '../componentes/TarjetaCoche';
import FiltrosCoches from '../componentes/FiltroCoches';
import '../styles/CatalogoCoches.css';

const CatalogoCoches = () => {
    const [coches, setCoches] = useState([]);
    const [cargar, setCargar] = useState(true);
    const [filtros, setFiltros] = useState({
        busqueda: '',
        combustible: '',
        precioMax: 100000,
        potenciaMin: 0
    });

    const fetchCoches = useCallback(async () => {
        setCargar(true);
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
            setCargar(false);
        }
    }, [filtros]);

    useEffect(() => {
        fetchCoches();
    }, [fetchCoches]);

    return (
        <div className="catalogo">
            <section className="hero-catalogo">
                <div className="hero-overlay">
                    <div className="hero-centrar-contenido">
                        <span className="etiqueta">Inventario Taller Motors</span>
                        <h1>Tu próximo coche te espera</h1>
                        <p>
                            Vehículos de ocasión rigurosamente inspeccionados en nuestro taller. 
                            Garantizamos transparencia, calidad y el mejor servicio post-venta.
                        </p>
                        <div className="iconos">
                            <div className="icono-confianza"><span>🛡️</span> 12 meses de garantía</div>
                            <div className="icono-confianza"><span>🔄</span> Aceptamos tu coche</div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="contenedor-catalogo">
                <main className="layout-principal">
                    <div className="barra-lateral-filtros">
                        <FiltrosCoches alFiltrar={(nuevosFiltros) => setFiltros(nuevosFiltros)} />
                    </div>

                    <div className="contenido-listado">
                        <div className="cuadricula-coches">
                            {cargar ? (
                                <div className="contenedor-cargando">
                                    <div className="icono-carga"></div>
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