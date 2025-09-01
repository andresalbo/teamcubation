import { NextFunction, Request, Response, Router } from "express";
import { AppDataSource } from "../config/datasource";
import { Pelicula } from "../model/Pelicula";
import { verificarToken2 } from "../middlewares/authMiddleWare";
import { z } from "zod";

export const peliculaRoute: Router = Router();

peliculaRoute.get('/peliculas', verificarToken2, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const peliSchema = z.object({
            pagina : z.number().min(1, "La pagina debe ser mayor a 0"),
            limite : z.number().min(1).max(99, "El limite debe ser entre 1 y 99")
        });
        const { titulo, director, anio, genero, sinopsis, pagina = 1, limite = 10 } = req.query;
        const qparams = {pagina: parseInt(pagina.toString()), limite: parseInt(limite.toString())}
        const valid = peliSchema.safeParse(qparams)
        if (!valid.success) {
            console.error(valid.error?.format())
            res.status(400).json(valid.error?.format())
            next(new Error("Error de validación"))
        }
        const skip = (Number(pagina) - 1) * Number(limite);
        const query = AppDataSource.getRepository(Pelicula)
            .createQueryBuilder("pelicula")
            .skip(skip)
            .take(Number(limite));
        if (titulo) query.andWhere("pelicula.titulo = :titulo", { titulo });
        if (director) query.andWhere("pelicula.director = :director", { director });
        if (anio) query.andWhere("pelicula.anio = :anio", { anio });
        if (genero) query.andWhere("pelicula.genero = :genero", { genero });
        if (sinopsis) query.andWhere("pelicula.sinopsis = :sinopsis", { sinopsis });
        const [peliculas, total] = await query.getManyAndCount();

        if (!peliculas || peliculas.length == 0) throw new Error("Peliculas no encontradas")
        res.json({
            total,
            page: Number(pagina),
            totalPages: Math.ceil(total / Number(limite)),
            peliculas
        });
    } catch (err) {
        next(err)
    }
});

peliculaRoute.get('/peliculas/:id', verificarToken2, async (req: Request, res: Response, next: NextFunction) => {
    try {
        let id = req.params.id;
        let pelicula = await AppDataSource.getRepository(Pelicula).findOne({
            where: { id: Number(id) },
            relations: ["calificaciones", "recomendaciones"]
        });
        if (!pelicula) throw new Error("pelicula no encontrada")
        res.json(pelicula);
    } catch (err) {
        next(err)
    }
});

peliculaRoute.post('/peliculas', verificarToken2, async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body) {
            const fechaSchema = z
                .string()
                .refine((val) => !isNaN(Date.parse(val)), {
                    message: "La fecha no es válida, usa el formato correcto (ISO 8601)",
                });
            const peliSchema = z.object({
                titulo: z.string().min(3),
                director: z.string().min(3),
                anio: fechaSchema,
                genero: z.string().min(3),
                sinopsis: z.string().min(3)
            });
            const valid = peliSchema.safeParse(req.body)
            if (!valid.success) {
                console.error(valid.error?.format())
                res.json(valid.error?.format())
                next();
            }
        }

        const user = AppDataSource.getRepository(Pelicula).create(req.body);
        const result = await AppDataSource.getRepository(Pelicula).save(user);
        res.json(result);
    } catch (error) {
        next(error)
    }

});

peliculaRoute.put('/peliculas/:id', verificarToken2, async (req: Request, res: Response, next: NextFunction) => {
    try {
        let id = req.params.id;
        let pelicula = await AppDataSource.getRepository(Pelicula).findOne({
            where: { id: Number(id) },
        });
        if (!pelicula) {
            throw new Error("pelicula no encontrada");
        }
        pelicula = AppDataSource.getRepository(Pelicula).merge(pelicula, req.body);
        await AppDataSource.getRepository(Pelicula).save(pelicula);
        res.json(pelicula)
    } catch (err) {
        next(err);
    }
});

peliculaRoute.delete('/peliculas/:id', verificarToken2, async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    let pelicula = await AppDataSource.getRepository(Pelicula).findOne({
        where: { id: Number(id) },
        relations: ["recomendaciones", "calificaciones"]
    });
    try {
        if (!pelicula) {
            throw new Error("Pelicula no encontrada");
        }
        await AppDataSource.getRepository(Pelicula).remove(pelicula);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }

});