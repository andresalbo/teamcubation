import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "MovieMatch",
    description: "API de Recomendaciones de Películas",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "../../swagger.json"; // Archivo generado
const routes = ["../index.ts"]; // Archivo principal donde están las rutas

swaggerAutogen()(outputFile, routes, doc);
