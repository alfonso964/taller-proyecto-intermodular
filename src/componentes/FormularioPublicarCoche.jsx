/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { uploadCocheImages } from '../services/subirCoches'; 
import '../styles/FormularioPublicarCoche.css';

const FormularioPublicarCoche = ({ onUpdate, datosEdicion }) => {
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
    
    useEffect(() => {
        if (datosEdicion) {
            setForm({
                marca: datosEdicion.marca || '',
                modelo: datosEdicion.modelo || '',
                precio: datosEdicion.precio || '',
                kms: datosEdicion.kms || '',
                combustible: datosEdicion.combustible || 'Gasolina',
                cv: datosEdicion.cv || '',
                año: datosEdicion.año || new Date().getFullYear(),
                descripcion: datosEdicion.descripcion || ''
            });
        } else {
            setForm({ marca: '', modelo: '', precio: '', kms: '', combustible: 'Gasolina', cv: '', año: 2026, descripcion: '' });
        }
    }, [datosEdicion]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!datosEdicion && files.length === 0) return alert("Por favor, selecciona al menos una foto.");
        
        setLoading(true);

        try {
            let urls = datosEdicion ? datosEdicion.imagenes : [];
            if (files.length > 0) {
                const nuevasUrls = await uploadCocheImages(files);
                urls = [...urls, ...nuevasUrls]; 
            }

            if (datosEdicion) {
                const { error } = await supabase
                    .from('coches_venta')
                    .update({ ...form, imagenes: urls })
                    .eq('id', datosEdicion.id);

                if (error) throw error;
                alert("¡Anuncio actualizado con éxito!");
            } else {
    
                const { error } = await supabase
                    .from('coches_venta')
                    .insert([{ ...form, imagenes: urls }]);

                if (error) throw error;
                alert("¡Coche publicado con éxito!");
            }

        
            if (onUpdate) onUpdate(); 
            
        } catch (error) {
            console.error(error);
            alert("Error en la operación: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-view-wrapper">
            <div className="admin-coches-container">
                <div className="form-header">
                    <h2>{datosEdicion ? '📝 Editando Anuncio' : '🚗 Panel de Ventas'}</h2>
                    <p>{datosEdicion ? `Modificando ${datosEdicion.marca} ${datosEdicion.modelo}` : 'Publicar nuevo vehículo en el inventario'}</p>
                </div>

                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-group">
                        <div className="input-field">
                            <label>Marca</label>
                            <input name="marca" value={form.marca} placeholder="Ej: BMW" onChange={handleChange} required />
                        </div>
                        <div className="input-field">
                            <label>Modelo</label>
                            <input name="modelo" value={form.modelo} placeholder="Ej: Serie 3" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="input-field">
                            <label>Precio (€)</label>
                            <input name="precio" type="number" value={form.precio} placeholder="0.00" onChange={handleChange} required />
                        </div>
                        <div className="input-field">
                            <label>Kilómetros</label>
                            <input name="kms" type="number" value={form.kms} placeholder="Ej: 45000" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="input-field">
                            <label>Combustible</label>
                            <select name="combustible" value={form.combustible} onChange={handleChange}>
                                <option value="Gasolina">Gasolina</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Híbrido">Híbrido</option>
                                <option value="Eléctrico">Eléctrico</option>
                            </select>
                        </div>

                        <div className="input-field">
                            <label>CV</label>
                            <input name="cv" type="number" value={form.cv} placeholder='100 CV' onChange={handleChange} required />
                        </div>

                        <div className="input-field">
                            <label>Año</label>
                            <input name="año" type="number" value={form.año} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="input-field">
                        <label>Descripción detallada</label>
                        <textarea name="descripcion" value={form.descripcion} placeholder="Detalles del estado, extras, mantenimiento..." onChange={handleChange}></textarea>
                    </div>

                    <div className="file-upload-zone">
                        <label htmlFor="file-upload" className="upload-label-wrapper">
                            <div className="upload-content">
                                <span className="upload-icon">📁</span>
                                <span className="file-label-text">
                                    {files.length > 0 ? `${files.length} fotos nuevas seleccionadas` : datosEdicion ? "Añadir más fotos (opcional)" : "Subir fotos del vehículo"}
                                </span>
                                <p className="file-hint">Haz clic aquí para gestionar imágenes</p>
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
                            <><span className="spinner"></span> Guardando...</>
                        ) : (
                            datosEdicion ? 'Guardar Cambios' : 'Publicar Anuncio'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FormularioPublicarCoche;