import express from 'express';
import { protegerRuta } from '../middlewares/authMiddleware.js';
import { 
    registrarDocumento, 
    obtenerDocumentos, 
    actualizarDocumento, 
    borrarDocumento 
} from '../controllers/documentosController.js';

const router = express.Router();

// GET /api/documentos -> Obtener todos los documentos
router.get('/', protegerRuta, obtenerDocumentos);

// POST /api/documentos -> Crear un nuevo documento (solo admins)
router.post('/', protegerRuta, registrarDocumento);

// PUT /api/documentos/:id -> Actualizar un documento (solo admins)
router.put('/:id', protegerRuta, actualizarDocumento);

// DELETE /api/documentos/:id -> Borrar un documento (solo admins)
router.delete('/:id', protegerRuta, borrarDocumento);

export default router;