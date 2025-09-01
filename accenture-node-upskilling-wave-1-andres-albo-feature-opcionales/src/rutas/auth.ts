import { NextFunction, Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../config/datasource";
import { Usuario } from "../model/Usuario";
import * as jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/secrets";

export const authRoute: Router = Router();

authRoute.post('/registracion', async (req: Request, res: Response, next: NextFunction) => {
    const nombre = req.body.nombre
    const psw = req.body.password
    const email = req.body.email

    if (!nombre || !psw || !email) {
         res.status(400).json({ message: "Faltan datos" });
         return;
    }
    const usuario = await registracion(req, res);
    if (usuario) {
        res.json({ Mensaje: "Usuario registrado con éxito" });
    } else {
        res.status(400).json({ message: "Faltan datos" });
    }
});

export const registracion = async(req: Request, res: Response) => {
    console.log("DEBUG LLAMANDO A REGISTRACION")
    const nombre = req.body.nombre
    const psw = req.body.password
    const email = req.body.email

    const hashedPassword = await bcrypt.hash(psw, 10);
    const usuario: Usuario = {
        id: 0,
        nombre: nombre,
        email: email,
        password: hashedPassword
    }
    const user = AppDataSource.getRepository(Usuario).create(usuario);
    await AppDataSource.getRepository(Usuario).save(user).catch(err => {
        return res.status(500).json({ message: "Error al registrar el usuario" });
    });
    return user;
}

authRoute.post("/login", async (req: Request, res: Response) => {
    const { nombre, email, password } = req.body;

    let usuario = await AppDataSource.getRepository(Usuario)
        .createQueryBuilder("usuario")
        .where("usuario.email = :email", { email })
        .addSelect("usuario.password")
        .getOne();
    if (!usuario) {
        res.status(400).json({ message: "Usuario no encontrado" });
        return
    }

    console.log(">>>>>", usuario)
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
        res.status(401).json({ message: "Contraseña incorrecta" });
        return
    }

    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ token });
});

