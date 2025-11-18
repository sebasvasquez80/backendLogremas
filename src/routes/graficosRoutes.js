import express from 'express';
import { protegerRuta } from '../middlewares/authMiddleware.js';
import { getGraficoUtilidad } from '../controllers/graficosController.js';
import { getCentros } from '../controllers/graficosController.js';

const router = express.Router();

// GET /api/documentos -> Obtener todos los documentos
router.get('/utilidad', protegerRuta, getGraficoUtilidad);
router.get('/centros', protegerRuta, getCentros);

export default router;