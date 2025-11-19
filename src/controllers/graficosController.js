import { supabase } from '../services/supabase.service.js';
// No necesitas la importación de Chart.js ni la lógica de transformación

export const getGraficoUtilidad = async (req, res) => {
    try {
        const { centroId, ano, mes } = req.query;

        if (!centroId || !ano) {
            return res.status(400).json({ 
                message: 'Se requiere un centroId y un año (ano) para generar el gráfico.' 
            });
        }

        // 1. Llamamos a la RPC para obtener los datos
        const { data, error } = await supabase.rpc('get_utilidad_grafico', {
            centro_id_param: centroId,
            ano_param: ano,
            mes_param: mes || null 
        });

        if (error) {
            throw error;
        }

        // 2. RETORNAMOS LOS DATOS TAL CUAL (Puros, sin formato Chart.js)
        // data: [ { fecha_label: 'Ene', utilidad_valor: -0.01 }, ... ]
        res.status(200).json(data);

    } catch (error) {
        console.error('Error en getGraficoUtilidad:', error.message); 
        res.status(500).json({ message: 'Error al obtener datos del gráfico', error: error.message });
    }
};

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