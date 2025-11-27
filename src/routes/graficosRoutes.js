import express from 'express';
import { protegerRuta } from '../middlewares/authMiddleware.js';
import { getGraficoUtilidad } from '../controllers/graficosController.js';
import { getCentros } from '../controllers/graficosController.js';
import { getGraficoPersonas } from '../controllers/graficosController.js';
import { getGraficoFacturacion } from '../controllers/graficosController.js';
import { getGraficoNomina } from '../controllers/graficosController.js';
import { getGraficoGastos } from '../controllers/graficosController.js';
import { getContratos, getCentrosNomina, getGraficoSalarioTransporte, getGraficoNovedades } from '../controllers/graficosController.js';


const router = express.Router();

// GET /api/documentos -> Obtener todos los documentos
router.get('/utilidad', protegerRuta, getGraficoUtilidad);
router.get('/centros', protegerRuta, getCentros);
router.get('/personas', protegerRuta, getGraficoPersonas);
router.get('/facturacion', protegerRuta, getGraficoFacturacion);
router.get('/nomina', protegerRuta, getGraficoNomina);
router.get('/gastos', protegerRuta, getGraficoGastos);
router.get('/contratos', protegerRuta, getContratos);

// --- NUEVAS RUTAS DE NÓMINA ---
// Ruta para obtener centros de nómina (filtrados por contrato)
router.get('/centros-nomina', protegerRuta, getCentrosNomina); 
router.get('/salario-transporte', protegerRuta, getGraficoSalarioTransporte); 
router.get('/novedades', protegerRuta, getGraficoNovedades); 

export default router;