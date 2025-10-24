import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;

// ### EL CAMBIO ESTÁ AQUÍ ###
// En lugar de la 'anon key', ahora usamos la 'service_role key'
// que es mucho más poderosa y se salta las políticas RLS.
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; 

// Crear y exportar el cliente de Supabase
// Este cliente ahora actuará como un "superusuario" desde nuestro backend.
export const supabase = createClient(supabaseUrl, supabaseKey);