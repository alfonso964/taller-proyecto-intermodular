import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { uploadCocheImages } from '../services/subirCoches'; 
import '../styles/FormularioPublicarCoche.css'; // Añadido el 'import' que faltaba

const FormularioPublicarCoche = () => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        marca: '', 
        modelo: '', 
        precio: '', 
        kms: '', 
        combustible: 'Gasolina', 
        cv: '',
        año: new Date().getFullYear(), 
        descripcion: ''
    });
    const [files, setFiles] = useState([]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (files.length === 0) return alert("Por favor, selecciona al menos una foto.");
        setLoading(true);

        try {
            const urls = await uploadCocheImages(files);
            const { error } = await supabase
                .from('coches_venta')
                .insert([{ ...form, imagenes: urls }]);

            if (error) throw error;

            alert("¡Coche publicado con éxito!");
            setForm({ marca: '', modelo: '', precio: '', kms: '', combustible: 'Gasolina',cv:'', año: 2026, descripcion: '' });
            setFiles([]);
            e.target.reset();
        } catch (error) {
            console.error(error);
            alert("Error al subir el coche: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-view-wrapper">
            <div className="admin-coches-container">
                <div className="form-header">
                    <h2>🚗 Panel de Ventas</h2>
                    <p>Publicar nuevo vehículo en el inventario</p>
                </div>

                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-group">
                        <div className="input-field">
                            <label>Marca</label>
                            <input name="marca" placeholder="Ej: BMW" onChange={handleChange} required />
                        </div>
                        <div className="input-field">
                            <label>Modelo</label>
                            <input name="modelo" placeholder="Ej: Serie 3" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="input-field">
                            <label>Precio (€)</label>
                            <input name="precio" type="number" placeholder="0.00" onChange={handleChange} required />
                        </div>
                        <div className="input-field">
                            <label>Kilómetros</label>
                            <input name="kms" type="number" placeholder="Ej: 45000" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="input-field">
                            <label>Combustible</label>
                            <select name="combustible" onChange={handleChange}>
                                <option value="Gasolina">Gasolina</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Híbrido">Híbrido</option>
                                <option value="Eléctrico">Eléctrico</option>
                            </select>
                        </div>

                        <div className="input-field">
                            <label>CV</label>
                            <input name="cv" type="number" placeholder='100 CV' defaultValue={form.cv} onChange={handleChange} required />
                        </div>

                        <div className="input-field">
                            <label>Año</label>
                            <input name="año" type="number" defaultValue={form.año} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="input-field">
                        <label>Descripción detallada</label>
                        <textarea name="descripcion" placeholder="Detalles del estado, extras, mantenimiento..." onChange={handleChange}></textarea>
                    </div>

                    {/* Zona de carga optimizada: ahora todo el label envuelve el contenido */}
                    <div className="file-upload-zone">
                        <label htmlFor="file-upload" className="upload-label-wrapper">
                            <div className="upload-content">
                                <span className="upload-icon">📁</span>
                                <span className="file-label-text">
                                    {files.length > 0 ? `${files.length} fotos seleccionadas` : "Subir fotos del vehículo"}
                                </span>
                                <p className="file-hint">Haz clic en cualquier parte de esta caja para seleccionar fotos</p>
                            </div>
                        </label>
                        <input 
                            id="file-upload"
                            type="file" 
                            multiple 
                            accept="image/*" 
                            onChange={(e) => setFiles(e.target.files)} 
                            className="hidden-file-input"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-submit-coche">
                        {loading ? (
                            <><span className="spinner"></span> Publicando...</>
                        ) : (
                            'Publicar Anuncio'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FormularioPublicarCoche;