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

// Controlador para obtener la lista de todos los centros
export const getCentros = async (req, res) => {
    try {
        // Leemos el nuevo parámetro de la URL
        const { contratoId } = req.query; 

        let query = supabase
          .from('centros')
          .select('id, nombre') 
          .order('nombre', { ascending: true });

        // APLICAMOS EL FILTRO CONDICIONAL
        if (contratoId) {
            // Filtra los centros por el ID de contrato
            query = query.eq('contrato_id', contratoId);
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        res.status(200).json(data);

    } catch (error) {
        console.error('Error en getCentros:', error.message);
        res.status(500).json({ message: 'Error al obtener lista de centros', error: error.message });
    }
};

// En graficosController.js

export const getContratos = async (req, res) => {
    try {
        // Consultamos la tabla 'contratos'
        const { data, error } = await supabase
          .from('contratos')
          .select('id, nombre') 
          .order('nombre', { ascending: true });

        if (error) {
            throw error;
        }

        // Renombramos 'nombre_empresa' a 'nombre' para que coincida con la estructura del frontend
        const contratosFormateados = data.map(contrato => ({
            id: contrato.id,
            nombre: contrato.nombre 
        }));

        res.status(200).json(contratosFormateados);

    } catch (error) {
        console.error('Error en getContratos:', error.message);
        res.status(500).json({ message: 'Error al obtener lista de contratos', error: error.message });
    }
};

// ... (El resto de tus controladores) ...
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

export const getGraficoGastos = async (req, res) => {
    try {
        const { centroId, ano, mesInicio, mesFin } = req.query;

        if (!centroId || !ano || !mesInicio || !mesFin) {
            return res.status(400).json({ 
                message: 'Se requiere Centro, Año, Mes de Inicio y Mes de Fin.' 
            });
        }

        // Llamamos a la RPC para obtener los datos puros de los 5 gastos
        const { data, error } = await supabase.rpc('get_gastos_grafico', {
            centro_id_param: centroId,
            ano_param: ano,
            mes_inicio_param: mesInicio, 
            mes_fin_param: mesFin
        });

        if (error) {
            throw error;
        }

        // RETORNAMOS LOS DATOS PUROS
        // Formato: [ { fecha_label: 'Ene', nomina: 96M, aux_transporte: 8M, ... }, ... ]
        res.status(200).json(data);

    } catch (error) {
        console.error('Error en getGraficoGastos:', error.message); 
        res.status(500).json({ message: 'Error al obtener datos del gráfico de gastos', error: error.message });
    }
};

// ... (Tus importaciones y funciones existentes) ...

// NUEVO CONTROLADOR: Obtiene centros de nómina filtrados por contrato
export const getCentrosNomina = async (req, res) => {
    try {
        const { contratoId } = req.query; 

        let query = supabase
          .from('centro_nomina')
          .select('id, nombre') // Usamos 'nombre' como se definió
          .order('nombre', { ascending: true });

        // APLICAMOS EL FILTRO CONDICIONAL: Solo centros ligados al contrato seleccionado
        if (contratoId) {
            query = query.eq('contrato_id', contratoId);
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        res.status(200).json(data);

    } catch (error) {
        console.error('Error en getCentrosNomina:', error.message);
        res.status(500).json({ message: 'Error al obtener lista de centros de nómina', error: error.message });
    }
};


// NUEVO CONTROLADOR: Obtiene datos de Salario vs Transporte
export const getGraficoSalarioTransporte = async (req, res) => {
    try {
        const { centroId, ano, mesInicio, mesFin } = req.query;

        if (!centroId || !ano || !mesInicio || !mesFin) {
            return res.status(400).json({ 
                message: 'Se requiere Centro de Nómina, Año, Mes de Inicio y Mes de Fin.' 
            });
        }

        // Llamamos a la RPC para obtener los datos puros (Salario y Transporte)
        const { data, error } = await supabase.rpc('get_salario_transporte_grafico', {
            centro_id_param: centroId,
            ano_param: ano,
            mes_inicio_param: mesInicio, 
            mes_fin_param: mesFin
        });

        if (error) {
            throw error;
        }

        // RETORNAMOS LOS DATOS PUROS
        // Formato: [ { fecha_label: 'Ene', salario_total: 150M, transporte_total: 10M }, ... ]
        res.status(200).json(data);

    } catch (error) {
        console.error('Error en getGraficoSalarioTransporte:', error.message); 
        res.status(500).json({ message: 'Error al obtener datos del gráfico de Salario vs Transporte', error: error.message });
    }
};