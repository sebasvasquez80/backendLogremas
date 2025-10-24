import { supabase } from '../services/supabase.service.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// --- FUNCIÓN PARA REGISTRAR UN NUEVO USUARIO (Sin cambios) ---
export const registrarUsuario = async (req, res) => {
    // (Esta función se queda igual que antes)
    const { nombre, usuario, contraseña, id_rol, id_subregion } = req.body;
    if (!nombre || !usuario || !contraseña || !id_rol || !id_subregion) {
        return res.status(400).json({ error: 'Faltan datos obligatorios: nombre, contraseña, id_rol' });
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const contraseñaEncriptada = await bcrypt.hash(contraseña, salt);
        const { data, error } = await supabase
            .from('usuarios')
            .insert([{ nombre, usuario, contraseña: contraseñaEncriptada, id_rol, id_subregion }])
            .select()
            .single();
        if (error) {
            if (error.code === '23505') {
                return res.status(409).json({ error: 'El nombre de usuario ya existe.' });
            }
            throw error;
        }
        res.status(201).json({ message: 'Usuario registrado exitosamente', usuario: data });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el usuario', details: error.message });
    }
};


// --- FUNCIÓN PARA INICIAR SESIÓN (CON LA CORRECCIÓN) ---
export const loginUsuario = async (req, res) => {
    const { usuario: nombreUsuario, contraseña } = req.body;
    if (!nombreUsuario|| !contraseña) {
        return res.status(400).json({ error: 'Faltan nombre de usuario o contraseña' });
    }

    try {
        const { data: usuarioEncontrado, error } = await supabase
            .from('usuarios')
            .select('*, rol:id_rol(nombre)')
            .eq('usuario', nombreUsuario)
            .single();

        if (error || !usuarioEncontrado) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        // ### NUEVA VERIFICACIÓN DE SEGURIDAD ###
        // Si por alguna razón la relación con la tabla 'rol' falla en la base de datos, 
        // 'usuario.rol' será nulo. Esta comprobación evita que la aplicación se rompa.
        if (!usuarioEncontrado.rol) {
            console.error("Error grave: la relación con la tabla 'rol' es nula para el usuario:", usuario);
            return res.status(500).json({ error: "Error de configuración del servidor: no se pudo encontrar el rol del usuario." });
        }

        const esContraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!esContraseñaValida) {
            return res.status(401).json({ error: 'Contraseña incorrecta.' });
        }

        const payload = {
            id: usuarioEncontrado.id,
            usuario: usuarioEncontrado.usuario,
            rol: usuarioEncontrado.rol.nombre,
            id_rol: usuarioEncontrado.id_rol,
            id_subregion: usuarioEncontrado.id_subregion
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token: token,
            usuario: payload
        });

    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor al intentar iniciar sesión', details: error.message });
    }
};

export const obtenerUsuarios = async (req, res) => {
    try {
        const { data, error } = await supabase.from('usuarios').select('id, nombre, usuario, id_rol, id_subregion');
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios', details: error.message });
    }
};

export const borrarUsuario = async (req, res) => {
    // Obtenemos el ID del usuario desde los parámetros de la URL (ej: /api/usuarios/5)
    const { id } = req.params;

    try {
        const { error } = await supabase
            .from('usuarios')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.status(200).json({ message: 'Usuario eliminado exitosamente' });

    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el usuario', details: error.message });
    }
};

export const actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    // Solo permitiremos actualizar el nombre y el rol, no la contraseña desde aquí.
    const { nombre, usuario, id_rol, id_subregion } = req.body;

    try {
        const { data, error } = await supabase
            .from('usuarios')
            .update({ nombre, usuario, id_rol, id_subregion })
            .eq('id', id)
            .select();

        if (error) throw error;
        if (data.length === 0) return res.status(404).json({ error: 'Usuario no encontrado.' });

        res.status(200).json({ message: 'Usuario actualizado exitosamente', usuario: data[0] });

    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el usuario', details: error.message });
    }
};
// --- FUNCIÓN PARA DATOS PROTEGIDOS (Sin cambios) ---
export const obtenerDatosProtegidos = async (req, res) => {
    // (Esta función se queda igual que antes)
    const usuario = req.user;
    try {
        const { data: links, error } = await supabase
            .from('documentos')
            .select('nombre, url')
            .eq('id_rol', usuario.id_rol);
        if (error) {
            throw error;
        }
        res.status(200).json({
            message: `Hola ${usuario.nombre}, tienes acceso a esta información porque tu rol es '${usuario.rol}'.`,
            links: links,
            usuario: usuario
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los documentos', details: error.message });
    }

};

export const cambiarContraseña = async (req, res) => {
    // 1. Get user ID from the token (added by protegerRuta)
    const userId = req.user.id; 

    // 2. Get passwords from the request body
    const { contraseñaActual, nuevaContraseña } = req.body;

    // 3. Basic validation
    if (!contraseñaActual || !nuevaContraseña) {
        return res.status(400).json({ error: 'Faltan la contraseña actual o la nueva contraseña.' });
    }
    if (nuevaContraseña.length < 6) { // Example: enforce minimum length
         return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres.' });
    }

    try {
        // 4. Fetch the user's current password hash from the database
        const { data: usuario, error: fetchError } = await supabase
            .from('usuarios')
            .select('contraseña')
            .eq('id', userId)
            .single();

        if (fetchError || !usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        // 5. Verify the current password
        const esValida = await bcrypt.compare(contraseñaActual, usuario.contraseña);
        if (!esValida) {
            return res.status(401).json({ error: 'La contraseña actual es incorrecta.' });
        }

        // 6. Hash the new password
        const salt = await bcrypt.genSalt(10);
        const nuevaContraseñaEncriptada = await bcrypt.hash(nuevaContraseña, salt);

        // 7. Update the password in the database
        const { error: updateError } = await supabase
            .from('usuarios')
            .update({ contraseña: nuevaContraseñaEncriptada })
            .eq('id', userId);

        if (updateError) {
            throw updateError;
        }

        res.status(200).json({ message: 'Contraseña actualizada exitosamente.' });

    } catch (error) {
        console.error("Error al cambiar contraseña:", error);
        res.status(500).json({ error: 'Error interno del servidor al cambiar la contraseña.', details: error.message });
    }
};