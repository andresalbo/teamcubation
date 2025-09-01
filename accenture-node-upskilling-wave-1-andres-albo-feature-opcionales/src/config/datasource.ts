import {DataSource} from "typeorm";
import dotenv from "dotenv";
import { Calificacion } from "../model/Calificacion";
import { Pelicula } from "../model/Pelicula";
import { Recomendacion } from "../model/Recomendacion";
import { Usuario } from "../model/Usuario";

try {
  dotenv.config();
} catch (err) {
  console.error("No se pudo inicializar las variables de entorno.")
}

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Usuario,Pelicula,Calificacion,Recomendacion],
    synchronize: true, // En producción, cambiar a false y usar migraciones
    logging: true,
  });