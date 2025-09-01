import * as jwt from "jsonwebtoken";
import { NextFunction, Request, Response, Router } from "express";
import { SECRET_KEY } from "../config/secrets";

export const verificarToken2 = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"];
    try {
        if (!token || !token.startsWith("Bearer ")) {
            res.status(403).json({ message: "Token requerido" });
        }
        if (token) {
            jwt.verify(token.split(" ")[1], SECRET_KEY, (err: any, user: any) => {
                if (err) {
                    res.status(401).json({ message: "Token inválido" });
                }
                console.log("user=", user)
                next();
            });
        }
    } catch (err) {
        return next(err)
    }
};