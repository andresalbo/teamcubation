import express = require("express");
import { Request, Response, NextFunction, Router } from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./config/datasource";
import { error } from "console";
import { v1Routes } from "./rutas/v1Routes";
import * as jwt from "jsonwebtoken";
import { calificacionRoute } from "./rutas/calificacionRoute";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.use(express.json());



AppDataSource.initialize().then(() => {
    console.log("db inicializada")
}).catch((err: any) => {
    console.log("error ds: " + err)
})

app.get("/", (req: Request, res: Response) => {
    res.send("Hola, Express con TypeScript!");
});



app.use('/api/v1', v1Routes);

// Swagger UI
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../swagger.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(200).json({ Error: err.message });
});

export  {app, AppDataSource, server };