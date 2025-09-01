import { NextFunction, Request, Response, Router } from "express";
import { AppDataSource } from "../config/datasource";
import { Calificacion } from "../model/Calificacion";
import { verificarToken2 } from "../middlewares/authMiddleWare";

export const calificacionRoute: Router = Router();



calificacionRoute.get('/calificacion/:id', verificarToken2, async (req: Request, res: Response, next: NextFunction) => {
    try {
        let id = req.params.id;
        let calificacion = await AppDataSource.getRepository(Calificacion).findOne({
            where: { id: Number(id) },
            relations: ["usuario", "pelicula"]
        });
        if (!calificacion) throw new Error("Calificacion no encontrada")
        res.json(calificacion);
    } catch (err:any) {
        next(err)
    }
});

calificacionRoute.post('/calificacion', verificarToken2, async (req: Request, res: Response) => {
    const user = AppDataSource.getRepository(Calificacion).create(req.body);
    const result = await AppDataSource.getRepository(Calificacion).save(user);
    res.json(result);
});

calificacionRoute.put('/calificacion/:id',verificarToken2,  async (req: Request, res: Response, next: NextFunction) => {
    try {
        let id = req.params.id;
        let calificacion = await AppDataSource.getRepository(Calificacion).findOne({
            where: { id: Number(id) },
        });
        if (!calificacion) {
            throw new Error("calificacion no encontrada");
        }
        calificacion = AppDataSource.getRepository(Calificacion).merge(calificacion, req.body);
        await AppDataSource.getRepository(Calificacion).save(calificacion);
        res.json(calificacion)
    } catch (err) {
        next(err);
    }
});

calificacionRoute.delete('/calificacion/:id',verificarToken2,  async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    let calificacion = await AppDataSource.getRepository(Calificacion).findOne({
        where: { id: Number(id) },
    });
    try {
        if (!calificacion) {
            throw new Error("Calificacion no encontrada");
        }
        await AppDataSource.getRepository(Calificacion).delete(id);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }

});
