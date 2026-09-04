const express = require("express");
const { fallo } = require("./errores");
const { router } = require("./usuarios.rutas");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const doc = YAML.load(path.join(__dirname, "../openapi.yaml"));

const app = express();

app.use(express.json());
// antes:
//app.use("/usuarios", router);
app.use("/v1/usuarios", router);


app.get("/salud", (_req, res) => res.json({ estado: "arriba" }));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(doc));

app.use((_req, res) => {
  return fallo(res, 404, "RUTA_NO_ENCONTRADA", "Ruta inexistente");
});

app.use((err, _req, res, _next) => {
  const malJson = err.type === "entity.parse.failed";
  console.error(err);

  return fallo(
    res,
    malJson ? 400 : 500,
    malJson ? "JSON_INVALIDO" : "ERROR_INTERNO",
    malJson ? "El cuerpo no es JSON válido" : "Error interno",
  );
});

module.exports = app;
