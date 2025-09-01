import { authRoute, registracion } from "../rutas/auth";
import express, { Request, Response } from "express";
import request from "supertest";
import { app, server} from "../index";
import { AppDataSource } from "../config/datasource";
import { Server, IncomingMessage, ServerResponse } from "http";
/*
beforeEach(async()=> {
  await AppDataSource.initialize();
})

afterEach(async()=> {
  await AppDataSource.destroy();
})
*/
afterAll(async() => {
  server.close(); // Cierra el servidor después de los tests
  await AppDataSource.destroy(); // Cierra la conexión a la base de datos
});

jest.mock("../rutas/auth", () => ({
  ...jest.requireActual("../rutas/auth"),
  registracion: jest.fn(), // Mockeamos específicamente la función
}));


//jest.mock("../rutas/auth.ts")

describe("post /registracion", () => {
  test("Debe retornar un mensaje de usuario creado",async () => {
    (registracion as jest.Mock).mockResolvedValue("Usuario registrado con éxito");

    const response = await request(app).post("/api/v1/registracion").send({
      "email": "andres.albo.test@accenture.com",
      "nombre": "andres.test",
      "password": "andres.test"
    })

    expect(response.status).toBe(200);
    expect(response.body).toEqual({"Mensaje": "Usuario registrado con éxito"});
  });
});

/*describe("get /recomendacion", () => {
  test("get Debe retornar un mensaje de usuario creado",async () => {

    const response = await request(app).get("/api/v1/recomendacion/simple?idUsuario=1&genero=genero1");

    expect(response.status).toBe(200);
    //expect(response.body).toEqual("Usuario registrado con éxito");
  });
});
*/