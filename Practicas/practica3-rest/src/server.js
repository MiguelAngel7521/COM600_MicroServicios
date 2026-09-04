require("dotenv").config();

const app = require("./app");
const { conectar } = require("./repositorio");

const PORT = process.env.PORT || 3000;

async function iniciar() {
  try {
    await conectar();
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo conectar con MongoDB", error);
    process.exit(1);
  }
}

iniciar();
