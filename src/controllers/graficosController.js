import { supabase } from '../services/supabase.service.js';

export const getGraficoUtilidad = async (req, res) => {
    try {
        // CORRECCIÓN: Ahora leemos mesInicio y mesFin
        const { centroId, ano, mesInicio, mesFin } = req.query;

        // Validación actualizada
        if (!centroId || !ano || !mesInicio || !mesFin) {
            return res.status(400).json({ 
                message: 'Se requiere Centro, Año, Mes de Inicio y Mes de Fin.' 
            });
        }

        // 1. Llamamos a la RPC para obtener los datos
        const { data, error } = await supabase.rpc('get_utilidad_grafico', {
            // Pasamos los 4 parámetros
            centro_id_param: centroId,
            ano_param: ano,
            mes_inicio_param: mesInicio, 
            mes_fin_param: mesFin
        });

        if (error) {
            throw error;
        }

        // 2. RETORNAMOS LOS DATOS PUROS
        res.status(200).json(data);

    } catch (error) {
        console.error('Error en getGraficoUtilidad:', error.message); 
        res.status(500).json({ message: 'Error al obtener datos del gráfico', error: error.message });
    }
};

// ... (getCentros está correcto, no se muestra aquí) ...

// Controlador para obtener la lista de todos los centros (NO CAMBIA)
export const getCentros = async (req, res) => {
    try {
        // Consultamos directamente la tabla 'centros'
        const { data, error } = await supabase
          .from('centros')
          .select('id, nombre') // Usando 'nombre' según tu última confirmación
          .order('nombre', { ascending: true }); 

        if (error) {
            throw error;
        }

        // Retornamos el array de centros
        res.status(200).json(data);

    } catch (error) {
        console.error('Error en getCentros:', error.message);
        res.status(500).json({ message: 'Error al obtener lista de centros', error: error.message });
    }
};


export const getGraficoPersonas = async (req, res) => {
    try {
        const { centroId, ano, mesInicio, mesFin } = req.query;

        if (!centroId || !ano || !mesInicio || !mesFin) {
            return res.status(400).json({ 
                message: 'Se requiere Centro, Año, Mes de Inicio y Mes de Fin.' 
            });
        }

        // 1. Llamamos a la RPC para obtener los datos
        const { data, error } = await supabase.rpc('get_personas_grafico', {
            centro_id_param: centroId,
            ano_param: ano,
            mes_inicio_param: mesInicio, 
            mes_fin_param: mesFin
        });

        if (error) {
            throw error;
        }

        // 2. RETORNAMOS LOS DATOS PUROS
        // Formato: [ { fecha_label: 'Ene', personas_valor: 50 }, ... ]
        // EL FRONTEND AHORA MANEJA LA TRANSFORMACIÓN A CHART.JS
        res.status(200).json(data);

    } catch (error) {
        console.error('Error en getGraficoPersonas:', error.message); 
        res.status(500).json({ message: 'Error al obtener datos del gráfico de personas', error: error.message });
    }
};

// ... (Tus otras funciones como getGraficoUtilidad, getGraficoPersonas y getCentros) ...

export const getGraficoFacturacion = async (req, res) => {
    try {
        const { centroId, ano, mesInicio, mesFin } = req.query;

        if (!centroId || !ano || !mesInicio || !mesFin) {
            return res.status(400).json({ 
                message: 'Se requiere Centro, Año, Mes de Inicio y Mes de Fin.' 
            });
        }

        // Llamamos a la RPC para obtener los datos puros
        const { data, error } = await supabase.rpc('get_facturacion_grafico', {
            centro_id_param: centroId,
            ano_param: ano,
            mes_inicio_param: mesInicio, 
            mes_fin_param: mesFin
        });

        if (error) {
            throw error;
        }

        // RETORNAMOS LOS DATOS PUROS
        // Formato: [ { fecha_label: 'Ene', facturacion_valor: 192494889 }, ... ]
        res.status(200).json(data);

    } catch (error) {
        console.error('Error en getGraficoFacturacion:', error.message); 
        res.status(500).json({ message: 'Error al obtener datos del gráfico de facturación', error: error.message });
    }
};

// ... (Tus otras funciones como getGraficoFacturacion y getCentros) ...

export const getGraficoNomina = async (req, res) => {
    try {
        const { centroId, ano, mesInicio, mesFin } = req.query;

        if (!centroId || !ano || !mesInicio || !mesFin) {
            return res.status(400).json({ 
                message: 'Se requiere Centro, Año, Mes de Inicio y Mes de Fin.' 
            });
        }

        // Llamamos a la RPC para obtener los datos puros
        const { data, error } = await supabase.rpc('get_nomina_grafico', {
            centro_id_param: centroId,
            ano_param: ano,
            mes_inicio_param: mesInicio, 
            mes_fin_param: mesFin
        });

        if (error) {
            throw error;
        }

        // RETORNAMOS LOS DATOS PUROS
        // Formato: [ { fecha_label: 'Ene', nomina_valor: 96885170 }, ... ]
        res.status(200).json(data);

    } catch (error) {
        console.error('Error en getGraficoNomina:', error.message); 
        res.status(500).json({ message: 'Error al obtener datos del gráfico de nómina', error: error.message });
    }
};