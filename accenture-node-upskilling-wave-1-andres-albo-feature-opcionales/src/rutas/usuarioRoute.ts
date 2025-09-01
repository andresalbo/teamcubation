import { NextFunction, Request, Response, Router } from "express";
import { Usuario } from "../model/Usuario";
import { AppDataSource } from "../config/datasource";
import { verificarToken2 } from "../middlewares/authMiddleWare";
import { z } from "zod";
export const userRoute: Router = Router();

userRoute.get('/usuarios/:id', verificarToken2, async (req: Request, res: Response, next: NextFunction) => {
    try {

        let id = req.params.id;
        let usuario = await AppDataSource.getRepository(Usuario).findOne({
            where: { id: Number(id) },
        });
        if (!usuario) throw new Error("Usuario no encontrado")

        const { password, ...usuarioSinPsw } = usuario;
        res.json(usuarioSinPsw);
    } catch (err) {
        next(err)
    }
});

userRoute.post('/usuarios', verificarToken2, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const usuarioSchema = z.object({
            nombre: z.string().min(3),
            email: z.string().min(5),
            password: z.string().min(8)
        })
        if (req.body) {
            const resultadoVal = usuarioSchema.safeParse(req.body);
            if (!resultadoVal.success) {
                throw new Error("Datos invalidos: " + resultadoVal.error);
            }
        } else {
            throw new Error("Datos invalidos");
        }
        const user = AppDataSource.getRepository(Usuario).create(req.body);
        const result = await AppDataSource.getRepository(Usuario).save(user);
        res.json(result);
    } catch (error) {
        next(error)
    }
});

userRoute.put('/usuarios/:id', verificarToken2, async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    let usuario = await AppDataSource.getRepository(Usuario).findOne({
        where: { id: Number(id) },
    });
    try {
        if (!usuario) {
            throw new Error("Usuario no encontrado");
        }
        let user = AppDataSource.getRepository(Usuario).merge(usuario, req.body);
        await AppDataSource.getRepository(Usuario).save(user);
        res.json(user)
    } catch (err) {
        next(err);
    }
});

userRoute.delete('/usuarios/:id', async (req: Request, res: Response, next: NextFunction) => {
    let id = req.params.id;
    let usuario = await AppDataSource.getRepository(Usuario).findOne({
        where: { id: Number(id) },
    });
    try {
        if (!usuario) {
            throw new Error("Usuario no encontrado");
        }
        await AppDataSource.getRepository(Usuario).delete(id);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }

});