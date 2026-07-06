import mongoose from "mongoose";

/**
 * Conexión a MongoDB con caché global.
 *
 * En desarrollo, Next.js recarga los módulos en cada cambio (HMR). Sin este
 * caché, cada recarga abriría una nueva conexión y agotaría el pool de Mongo.
 * Guardamos la conexión (y la promesa en curso) en `globalThis` para reutilizarla.
 */

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// eslint-disable-next-line no-var
declare global {
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache =
  global._mongooseCache ?? (global._mongooseCache = { conn: null, promise: null });

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;

  if (!MONGODB_URI) {
    throw new Error(
      "Falta la variable de entorno MONGODB_URI. Copiá .env.example a .env.local y completala."
    );
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      // Evita que Mongoose acumule queries en buffer si la conexión falla.
      bufferCommands: false,
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    // Si falla, limpiamos la promesa para permitir un reintento en la próxima llamada.
    cache.promise = null;
    throw error;
  }

  return cache.conn;
}
