const EntitySchema = require('typeorm').EntitySchema;

module.exports = new EntitySchema({
  name: 'Gym',
  tableName: 'gym',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    name: {
      type: 'varchar',
    },
    city: {
      type: 'varchar',
      default: null,
    },
    isAccepted: {
      type: 'boolean',
      default: false,
    },
  },
  relations: {
    users: {
      target: 'User',
      inverseSide: 'gyms',
      type: 'many-to-many',
      joinTable: true,
      cascade: false,
    },
    mainAdmin: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: true,
    },
  },
});
