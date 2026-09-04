const { MongoClient, ObjectId } = require("mongodb");

let coleccion;

async function conectar() {
  const cliente = await new MongoClient(process.env.MONGO_URL).connect();
  coleccion = cliente.db(process.env.MONGO_DB).collection("usuarios");
  await coleccion.createIndex({ correo: 1 }, { unique: true });
  return cliente;
}

const aId = id => (ObjectId.isValid(id) ? new ObjectId(id) : null);

async function listar(filtro, orden, pagina, limite) {
  const consulta = coleccion
    .find(filtro)
    .sort(orden)
    .skip((pagina - 1) * limite)
    .limit(limite);

  const [datos, total] = await Promise.all([
    consulta.toArray(),
    coleccion.countDocuments(filtro),
  ]);

  return { datos, total };
}

module.exports = {
  conectar,
  listar,
  crear: usuario => coleccion.insertOne(usuario),
  obtener: id => (aId(id) ? coleccion.findOne({ _id: aId(id) }) : null),
  reemplazar: (id, usuario) =>
    aId(id)
      ? coleccion.replaceOne({ _id: aId(id) }, usuario)
      : Promise.resolve({ matchedCount: 0 }),
  borrar: id =>
    aId(id)
      ? coleccion.deleteOne({ _id: aId(id) })
      : Promise.resolve({ deletedCount: 0 }),
  porCorreo: correo => coleccion.findOne({ correo }),
};
