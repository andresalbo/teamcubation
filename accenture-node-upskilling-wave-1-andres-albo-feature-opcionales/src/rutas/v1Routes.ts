import { Router } from "express";
import { userRoute } from "./usuarioRoute";
import { peliculaRoute } from "./peliculaRoute";
import { calificacionRoute } from "./calificacionRoute";
import { recomendacionRoute } from "./recomendacionRoute";
import { authRoute } from "./auth";

export const v1Routes: Router = Router();
v1Routes.use(userRoute);
v1Routes.use(peliculaRoute)
v1Routes.use(calificacionRoute)
v1Routes.use(recomendacionRoute)
v1Routes.use(authRoute);