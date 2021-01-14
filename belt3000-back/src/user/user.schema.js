const EntitySchema = require('typeorm').EntitySchema;

module.exports = new EntitySchema({
  name: 'User',
  tableName: 'user',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    role: {
      type: 'int',
    },
    firstname: {
      type: 'varchar',
    },
    lastname: {
      type: 'varchar',
    },
    email: {
      type: 'varchar',
    },
    password: {
      type: 'varchar',
    },
    isAdult: {
      type: 'boolean',
    },
    belt: {
      type: 'varchar',
      default: null,
    },
    stripes: {
      type: 'int',
      default: null,
    },
  },
});
