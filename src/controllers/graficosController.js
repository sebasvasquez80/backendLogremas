import { supabase } from '../services/supabase.service.js';

// Importa tu cliente de Supabase (ya deberías tenerlo)
// import { supabase } from './supabaseClient';

export const getGraficoUtilidad = async (req, res) => {
  try {
    // 1. Leemos los filtros que vienen del frontend
    // Ej: /api/graficos/utilidad?centroId=1&ano=2024
    const { centroId, ano, mes } = req.query;

    // Validación mínima: Requerimos un centro y un año
    if (!centroId || !ano) {
      return res.status(400).json({ 
        message: 'Se requiere un centroId y un año (ano) para generar el gráfico.' 
      });
    }

    // 2. Llamamos a la RPC que acabamos de crear en Supabase
    const { data, error } = await supabase.rpc('get_utilidad_grafico', {
      // 3. Pasamos los parámetros a la función SQL
      centro_id_param: centroId,
      ano_param: ano,
      mes_param: mes || null // Si el 'mes' no viene en la URL, enviamos NULL
    });

    if (error) {
      throw error;
    }

    // 4. ¡Transformación! Preparamos los datos para Chart.js
    // 'data' viene así: [ { fecha_label: 'Ene', utilidad_valor: -0.01 }, { fecha_label: 'Feb', ... } ]

    const labels = data.map(item => item.fecha_label);
    const valores = data.map(item => item.utilidad_valor);

    // Este es el objeto que Chart.js espera
    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Utilidad',
          data: valores,
          fill: false,
          borderColor: 'rgb(54, 162, 235)', // Un color azul
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          tension: 0.1 // Suaviza la línea
        }
      ]
    };

    // 5. Enviamos los datos listos para el gráfico al frontend
    res.status(200).json(chartData);

  } catch (error) {
    console.error('Error en getGraficoUtilidad:', error.message); 
    res.status(500).json({ message: 'Error al obtener datos del gráfico', error: error.message });
  }
};

// Controlador para obtener la lista de todos los centros
export const getCentros = async (req, res) => {
  try {
    // 1. Consultamos directamente la tabla 'centros'
    const { data, error } = await supabase
      .from('centros')
      .select('id, nombre') // Solo traemos el ID y el nombre
      .order('nombre', { ascending: true }); // Los ordenamos alfabéticamente

    if (error) {
      throw error;
    }

    // 2. 'data' ya es un array: [ { id: 1, nombre_centro: 'SCPO' }, { id: 2, ... } ]
    res.status(200).json(data);

  } catch (error) {
    console.error('Error en getCentros:', error.message);
    res.status(500).json({ message: 'Error al obtener lista de centros', error: error.message });
  }
};