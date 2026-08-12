const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Lugar',
  tableName: 'lugar',
  columns: {
    id: { type: 'int', primary: true, generated: true },
    nombre: { type: 'varchar', length: 50 },
  },
});