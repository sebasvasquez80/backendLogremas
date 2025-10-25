import { supabase } from '../services/supabase.service.js';

export const registrarDocumento = async (req, res) => {
    const { nombre, url, id_subregion, id_rol, id_pagina } = req.body;
    if (!nombre || !url || !id_subregion || !id_rol || !id_pagina) {
        return res.status(400).json({ error: 'Faltan datos obligatorios: nombre, url, id_subregion, id_rol, id_pagina' });
    }
    try {
        const { data, error } = await supabase
            .from('documentos')
            .insert([{ nombre, url, id_subregion, id_rol, id_pagina }])
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

        const usuarioAutenticado = req.user;
        // Leemos los posibles filtros que vienen en la URL (ej: ?page_id=2)
        const { id_pagina } = req.query;

        // Empezamos a construir la consulta a la base de datos
        let query = supabase.from('documentos').select('*'); // Seleccionamos todo

        // Si nos pasaron un 'page_id' en la URL, añadimos un filtro a la consulta
        if (id_pagina) {
            query = query.eq('id_pagina', id_pagina);
        }

        if (usuarioAutenticado.id_rol !== 1 && usuarioAutenticado.id_rol !== 4) {
            // Si NO es Admin NI Desarrollo, APLICA el filtro de subregión

            // Verificamos si la subregión existe en el token antes de filtrar
            if (usuarioAutenticado.id_subregion != null) {
                query = query.eq('id_subregion', usuarioAutenticado.id_subregion);
            } else {
                console.warn(`Usuario ${usuarioAutenticado.usuario} (rol ${usuarioAutenticado.id_rol}) no tiene subregión definida en el token. No se mostrarán documentos.`);
            }
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
    const { nombre, url, id_subregion, id_rol, id_pagina } = req.body;
    try {
        const { data, error } = await supabase
            .from('documentos')
            .update({ nombre, url, id_subregion, id_rol, id_pagina })
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