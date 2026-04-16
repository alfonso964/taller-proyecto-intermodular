import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { FaWhatsapp, FaChevronLeft, FaChevronRight, FaTag } from 'react-icons/fa';
import '../styles/DetalleCoche.css';

const DetalleCoche = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [coche, setCoche] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fotoPrincipal, setFotoPrincipal] = useState("");

    useEffect(() => {
        const fetchCoche = async () => {
            try {
                const { data, error } = await supabase
                    .from('coches_venta')
                    .select('*')
                    .eq('id', id)
                    .single();
                
                if (error) throw error;
                
                setCoche(data);
                
                const imgs = data.imagenes && data.imagenes.length > 0 ? data.imagenes : [data.imagen];
                setFotoPrincipal(imgs[0]);
            } catch (error) {
                console.error("Error:", error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCoche();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return <div className="loading-screen">Cargando...</div>;
    if (!coche) return <div className="error-screen">Vehículo no encontrado</div>;

    const imagenes = coche.imagenes && coche.imagenes.length > 0 ? coche.imagenes : [coche.imagen];

    // Lógica para las flechas
    const cambiarImagen = (direccion) => {
        const indiceActual = imagenes.indexOf(fotoPrincipal);
        let nuevoIndice;

        if (direccion === 'next') {
            nuevoIndice = (indiceActual + 1) % imagenes.length;
        } else {
            nuevoIndice = (indiceActual - 1 + imagenes.length) % imagenes.length;
        }
        setFotoPrincipal(imagenes[nuevoIndice]);
    };

    return (
        <main className="atelier-page">
            <div className="atelier-container">
                <nav className="atelier-nav">
                    <button onClick={() => navigate('/coches')}>
                        <FaChevronLeft /> INVENTARIO / {coche.marca.toUpperCase()} / {coche.modelo.toUpperCase()}
                    </button>
                </nav>

                <div className="atelier-grid">
                    <section className="atelier-gallery">
                        <div className="main-image-container">
                            
                            {/* Flechas de navegación */}
                            {imagenes.length > 1 && (
                                <>
                                    <button className="nav-arrow prev" onClick={() => cambiarImagen('prev')}>
                                        <FaChevronLeft />
                                    </button>
                                    <button className="nav-arrow next" onClick={() => cambiarImagen('next')}>
                                        <FaChevronRight />
                                    </button>
                                </>
                            )}
                            
                            <img src={fotoPrincipal} alt={coche.modelo} />
                        </div>
                        
                        {imagenes.length > 1 && (
                            <div className="thumbnails-grid">
                                {imagenes.map((img, idx) => (
                                    <img 
                                        key={idx} 
                                        src={img} 
                                        alt={`Vista ${idx + 1}`} 
                                        className={`thumb-img ${fotoPrincipal === img ? 'active' : ''}`}
                                        onClick={() => setFotoPrincipal(img)}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    <aside className="atelier-info">
                        <header className="info-header">
                            <h1 className="info-title">{coche.año} {coche.marca} {coche.modelo}</h1>
                            <div className="info-precio">
                                {Number(coche.precio).toLocaleString('es-ES')}€ <span className="iva">IVA INCL.</span>
                            </div>
                        </header>

                        <div className="specs-card">
                            <div className="spec-item">
                                <span className="especificacion">KILOMETRAJE</span>
                                <span className="spec-value">{Number(coche.kms).toLocaleString('es-ES')} KM</span>
                            </div>
                            <div className="spec-item">
                                <span className="especificacion">MOTORIZACIÓN</span>
                                <span className="spec-value">{coche.combustible.toUpperCase()}</span>
                            </div>
                            <div className="spec-item">
                                <span className="especificacion">AÑO</span>
                                <span className="spec-value">{coche.año}</span>
                            </div>
                            <div className="spec-item">
                                <span className="especificacion">GARANTÍA</span>
                                <span className="spec-value">12 MESES</span>
                            </div>
                        </div>

                        <div className="analisis-tecnico">
                            <h3>ANÁLISIS TÉCNICO</h3>
                            <p>{coche.descripcion}</p>
                        </div>

                        <button 
                            className="atelier-cta"
                            onClick={() => window.open(`https://wa.me/34600000000?text=Hola, me interesa el ${coche.marca} ${coche.modelo}`)}
                        >
                            <FaWhatsapp /> CONTACTAR POR WHATSAPP
                        </button>
                    </aside>
                </div>
            </div>
        </main>
    );
};

export default DetalleCoche;