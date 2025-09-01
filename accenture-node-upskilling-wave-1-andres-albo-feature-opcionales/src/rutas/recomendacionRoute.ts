import { NextFunction, Request, Response, Router } from "express";
import { AppDataSource } from "../config/datasource";
import { Recomendacion } from "../model/Recomendacion";
import { verificarToken2 } from "../middlewares/authMiddleWare";
import { Calificacion } from "../model/Calificacion";

export const recomendacionRoute: Router = Router();

recomendacionRoute.get('/recomendacion/simple', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.query.idUsuario;
        const genero = req.query.genero
        let recomendaciones = await AppDataSource.getRepository(Calificacion).createQueryBuilder("recomendacion")
            .innerJoinAndSelect("recomendacion.usuario", "usuario")
            .innerJoinAndSelect("recomendacion.pelicula", "pelicula")
            .where("pelicula.genero = :genero", { genero })
            .andWhere("usuario.id = :id", { id: id })
            .getMany();
        if (!recomendaciones || recomendaciones.length == 0) throw new Error("No existen recomendaciones")
        recomendaciones = recomendaciones.filter((arg) => {
            return arg.puntaje >= 4
        })
        res.json(recomendaciones);
    } catch (err: any) {
        next(err)
    }
});

recomendacionRoute.get('/recomendacion/:id', verificarToken2, async (req: Request, res: Response, next: NextFunction) => {
    try {
        let id = req.params.id;
        let recomendacion = await AppDataSource.getRepository(Recomendacion).findOne({
            where: { id: Number(id) },
            relations: ["usuario", "pelicula"]
        });
        if (!recomendacion) throw new Error("Recomendacion no encontrada")
        res.json(recomendacion);
    } catch (err: any) {
        next(err)
    }
});

recomendacionRoute.post('/recomendacion', verificarToken2, async (req: Request, res: Response) => {
    const recomendacion = AppDataSource.getRepository(Recomendacion).create(req.body);
    const result = await AppDataSource.getRepository(Recomendacion).save(recomendacion);
    res.json(result);
});

recomendacionRoute.put('/recomendacion/:id', verificarToken2, async (req: Request, res: Response, next: NextFunction) => {
    try {
        let id = req.params.id;
        let recomendacion = await AppDataSource.getRepository(Recomendacion).findOne({
            where: { id: Number(id) },
        });
        if (!recomendacion) {
            throw new Error("recomendacion no encontrada");
        }
        recomendacion = AppDataSource.getRepository(Recomendacion).merge(recomendacion, req.body);
        await AppDataSource.getRepository(Recomendacion).save(recomendacion);
        res.json(recomendacion)
    } catch (err) {
        next(err);
    }
});

recomendacionRoute.delete('/recomendacion/:id', verificarToken2, async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    let recomendacion = await AppDataSource.getRepository(Recomendacion).findOne({
        where: { id: Number(id) },
    });
    try {
        if (!recomendacion) {
            throw new Error("Recomendacion no encontrada");
        }
        await AppDataSource.getRepository(Recomendacion).delete(id);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }

});