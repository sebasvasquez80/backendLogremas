import { supabase } from '../services/supabase.service.js';

export const registrarDocumento = async (req, res) => {
    const { nombre, url, id_rol, page_id } = req.body;
    if (!nombre || !url || !id_rol || !page_id) {
        return res.status(400).json({ error: 'Faltan datos obligatorios: nombre, url, id_rol' });
    }
    try {
        const { data, error } = await supabase
            .from('documentos')
            .insert([{ nombre, url, id_rol, page_id }])
            .select()
            .single();
        if (error) throw error;
        res.status(201).json({ message: 'Documento guardado correctamente', documento: data });
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar documento', details: error.message });
    }
};

// En: src/controllers/documentosController.js

export const obtenerDocumentos = async (req, res) => {
    try {
        // Leemos los posibles filtros que vienen en la URL (ej: ?page_id=2)
        const { page_id } = req.query;

        // Empezamos a construir la consulta a la base de datos
        let query = supabase.from('documentos').select('*'); // Seleccionamos todo

        // Si nos pasaron un 'page_id' en la URL, añadimos un filtro a la consulta
        if (page_id) {
            query = query.eq('page_id', page_id);
        }

        // Ejecutamos la consulta (con o sin el filtro)
        const { data, error } = await query;

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los documentos', details: error.message });
    }
};

export const actualizarDocumento = async (req, res) => {
    const { id } = req.params;
    const { nombre, url, id_rol, page_id } = req.body;
    try {
        const { data, error } = await supabase
            .from('documentos')
            .update({ nombre, url, id_rol, page_id })
            .eq('id', id)
            .select();
        if (error) throw error;
        if (data.length === 0) return res.status(404).json({ error: 'Documento no encontrado.' });
        res.status(200).json({ message: 'Documento actualizado exitosamente', documento: data[0] });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar documento', details: error.message });
    }
};

export const borrarDocumento = async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase.from('documentos').delete().eq('id', id);
        if (error) throw error;
        res.status(200).json({ message: 'Documento eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el Documento', details: error.message });
    }
};