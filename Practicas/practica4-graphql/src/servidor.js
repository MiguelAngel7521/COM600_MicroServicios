const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const depthLimit = require('graphql-depth-limit');
const typeDefs = require('./esquema');
const resolvers = require("./resolvers");
const { crearCargadores } = require("./cargadores");
async function main() {
const server = new ApolloServer({
typeDefs,
resolvers,
validationRules: [depthLimit(6)],
formatError: (err) => {
console.error('[GraphQL]', err);
return {
message: err.message,
code: err.extensions && err.extensions.code,
path: err.path,
};
},
});
const { url } = await startStandaloneServer(server, {
listen: { port: 4000 },
context: async () => ({ cargadores: crearCargadores() }),
});
console.log('GraphQL escuchando en ' + url);
}
main();
