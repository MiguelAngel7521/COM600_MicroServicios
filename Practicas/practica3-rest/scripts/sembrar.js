require("dotenv").config();

const { MongoClient } = require("mongodb");

(async () => {
  const cliente = await new MongoClient(process.env.MONGO_URL).connect();
  const coleccion = cliente
    .db(process.env.MONGO_DB)
    .collection("usuarios");

  const lote = Array.from({ length: 10000 }, (_, i) => ({
    nombre: `Usuario ${i}`,
    correo: `usuario${i}@usfx.bo`,
    edad: 18 + (i % 45),
  }));

  await coleccion.insertMany(lote);
  console.log("documentos:", await coleccion.countDocuments());
  await cliente.close();
})();
