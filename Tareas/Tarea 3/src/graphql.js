const { buildSchema } = require('graphql');
const { createHandler } = require('graphql-http/lib/use/express');

const schema = buildSchema(`
  type Trabajador {
    id: ID!
    nombre: String!
    apellido: String!
    cedulaIdentidad: String!
    cargo: String!
    departamento: String!
    fechaIngreso: String!
  }

  input TrabajadorInput {
    nombre: String!
    apellido: String!
    cedulaIdentidad: String!
    cargo: String!
    departamento: String!
    fechaIngreso: String!
  }

  input TrabajadorActualizacionInput {
    nombre: String
    apellido: String
    cedulaIdentidad: String
    cargo: String
    departamento: String
    fechaIngreso: String
  }

  type Query {
    obtenerTrabajadores: [Trabajador!]!
    obtenerTrabajador(id: ID!): Trabajador
  }

  type Mutation {
    crearTrabajador(datos: TrabajadorInput!): Trabajador!
    actualizarTrabajador(id: ID!, datos: TrabajadorActualizacionInput!): Trabajador
    eliminarTrabajador(id: ID!): Boolean!
  }
`);

const convertirTrabajador = (trabajador) => {
  if (!trabajador) return null;
  return {
    id: trabajador._id.toString(),
    nombre: trabajador.nombre,
    apellido: trabajador.apellido,
    cedulaIdentidad: trabajador.cedulaIdentidad,
    cargo: trabajador.cargo,
    departamento: trabajador.departamento,
    fechaIngreso: trabajador.fechaIngreso.toISOString()
  };
};

const crearResolvers = (Trabajador) => ({
  obtenerTrabajadores: async () => {
    const trabajadores = await Trabajador.find().sort({ apellido: 1, nombre: 1 });
    return trabajadores.map(convertirTrabajador);
  },
  obtenerTrabajador: async ({ id }) => convertirTrabajador(await Trabajador.findById(id)),
  crearTrabajador: async ({ datos }) => convertirTrabajador(await Trabajador.create(datos)),
  actualizarTrabajador: async ({ id, datos }) => convertirTrabajador(
    await Trabajador.findByIdAndUpdate(id, datos, { new: true, runValidators: true })
  ),
  eliminarTrabajador: async ({ id }) => Boolean(await Trabajador.findByIdAndDelete(id))
});

const configurarGraphQL = (app, Trabajador) => {
  app.get('/graphiql', (_req, res) => {
    res.type('html').send(`<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>GraphiQL - Trabajadores</title>
    <link rel="stylesheet" href="https://unpkg.com/graphiql@3/graphiql.min.css">
  </head>
  <body style="margin:0;height:100vh;overflow:hidden">
    <div id="graphiql" style="height:100vh"></div>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/graphiql@3/graphiql.min.js"></script>
    <script>
      const fetcher = GraphiQL.createFetcher({ url: '/graphql' });
      ReactDOM.createRoot(document.getElementById('graphiql')).render(
        React.createElement(GraphiQL, { fetcher })
      );
    </script>
  </body>
</html>`);
  });

  app.all('/graphql', createHandler({
    schema,
    rootValue: crearResolvers(Trabajador)
  }));
};

module.exports = configurarGraphQL;