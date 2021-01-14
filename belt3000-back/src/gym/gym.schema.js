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
    },
  },
  relations: {
    headCoach: {
      target: 'User',
      type: 'many-to-one',
    },
  },
});
