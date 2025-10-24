import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import usuariosRoutes from './src/routes/usuariosRoutes.js';
import documentosRoutes from './src/routes/documentosRoutes.js';

// Cargar variables de entorno
dotenv.config();

// Inicializar la aplicación de Express
const app = express();

// Middlewares
app.use(cors()); // Habilita CORS para permitir peticiones desde otros dominios
app.use(express.json()); // Permite que el servidor entienda peticiones con cuerpo en formato JSON

// Rutas de la API
// Todas las rutas definidas en 'empleadosRoutes' empezarán con '/api/empleados'
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/documentos', documentosRoutes);

// Definir el puerto
const PORT = process.env.PORT || 4000;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

app.get("/", (_, res) => res.send("API corona corriendo"));

// Exportar la app para que Vercel pueda usarla
export default app;