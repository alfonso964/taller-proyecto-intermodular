import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { FaWhatsapp, FaChevronLeft, FaChevronRight, FaTag } from 'react-icons/fa';
import '../styles/DetalleCoche.css';

const DetalleCoche = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [coche, setCoche] = useState(null);
    const [cargar, setCargar] = useState(true);
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
                setCargar(false);
            }
        };
        fetchCoche();
        window.scrollTo(0, 0);
    }, [id]);

    if (cargar) return <div className="loading-screen">Cargando...</div>;
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
        <main className="pagina">
            <div className="contenedor">
                <nav className="navegacion">
                    <button onClick={() => navigate('/coches')}>
                        <FaChevronLeft /> INVENTARIO / {coche.marca.toUpperCase()} / {coche.modelo.toUpperCase()}
                    </button>
                </nav>

                <div className="atelier-grid">
                    <section className="atelier-gallery">
                        <div className="contenedor-imagen-principal">
                            
                            {imagenes.length > 1 && (
                                <>
                                    <button className="flecha-navegacion prev" onClick={() => cambiarImagen('prev')}>
                                        <FaChevronLeft />
                                    </button>
                                    <button className="flecha-navegacion next" onClick={() => cambiarImagen('next')}>
                                        <FaChevronRight />
                                    </button>
                                </>
                            )}
                            
                            <img src={fotoPrincipal} alt={coche.modelo} />
                        </div>
                        
                        {imagenes.length > 1 && (
                            <div className="miniaturas">
                                {imagenes.map((img, indice) => (
                                    <img 
                                        key={indice} 
                                        src={img} 
                                        alt={`Vista ${indice + 1}`} 
                                        className={`imagen-miniatura ${fotoPrincipal === img ? 'active' : ''}`}
                                        onClick={() => setFotoPrincipal(img)}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    <aside className="atelier-info">
                        <header className="info-header">
                            <h1 className="titulo-info">{coche.año} {coche.marca} {coche.modelo}</h1>
                            <div className="precio">
                                {Number(coche.precio).toLocaleString('es-ES')}€ <span className="iva">IVA INCL.</span>
                            </div>
                        </header>

                        <div className="tarjeta-especificaciones">
                            <div className="especificaciones-item">
                                <span className="especificacion">KILOMETRAJE</span>
                                <span className="valor-especificacion">{Number(coche.kms).toLocaleString('es-ES')} KM</span>
                            </div>
                            <div className="especificaciones-item">
                                <span className="especificacion">MOTORIZACIÓN</span>
                                <span className="valor-especificacion">{coche.combustible.toUpperCase()}</span>
                            </div>
                            <div className="especificaciones-item">
                                <span className="especificacion">AÑO</span>
                                <span className="valor-especificacion">{coche.año}</span>
                            </div>
                            <div className="especificaciones-item">
                                <span className="especificacion">GARANTÍA</span>
                                <span className="valor-especificacion">12 MESES</span>
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