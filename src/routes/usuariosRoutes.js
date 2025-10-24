import express from 'express';
import { registrarUsuario, loginUsuario, obtenerDatosProtegidos } from '../controllers/usuariosController.js';
import { protegerRuta } from '../middlewares/authMiddleware.js';
import { obtenerUsuarios } from '../controllers/usuariosController.js';
import { borrarUsuario } from '../controllers/usuariosController.js';
import {actualizarUsuario} from '../controllers/usuariosController.js';
import { cambiarContraseña } from '../controllers/usuariosController.js';

const router = express.Router();

// Ruta para registrar un nuevo usuario (pública)
router.post('/register', registrarUsuario);

// Ruta para iniciar sesión (pública)
router.post('/login', loginUsuario);

router.get('/', protegerRuta, obtenerUsuarios);
// Ruta de ejemplo que está protegida.
// Para acceder, el frontend debe enviar el token JWT en el header 'Authorization'.
// El middleware 'protegerRuta' se ejecuta primero. Si el token es válido,
// entonces se ejecuta 'obtenerDatosProtegidos'.
router.get('/documentos', protegerRuta, obtenerDatosProtegidos);


// Rutas protegidas para operaciones CRUD de usuarios

router.put('/change-password', protegerRuta, cambiarContraseña);

router.delete('/:id', protegerRuta, borrarUsuario);

router.put('/:id', protegerRuta, actualizarUsuario);


export default router;