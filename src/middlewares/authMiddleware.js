import jwt from 'jsonwebtoken';

export const protegerRuta = (req, res, next) => {
    let token;

    // 1. Revisar si el token viene en los headers de la petición
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Extraer el token (formato "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // 3. Verificar la validez del token con nuestro secreto
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Añadir la información del usuario (del token) al objeto 'req'
            // para que esté disponible en las siguientes funciones (controllers)
            req.user = decoded;

            // 5. Si todo está bien, continuar a la siguiente función (el controlador)
            next();
        } catch (error) {
            return res.status(401).json({ error: 'Token no válido o expirado. Acceso denegado.' });
        }
    }

    if (!token) {
        return res.status(401).json({ error: 'No hay token en la petición. Acceso denegado.' });
    }
};