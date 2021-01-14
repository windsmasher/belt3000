const EntitySchema = require('typeorm').EntitySchema;

module.exports = new EntitySchema({
  name: 'Nomination',
  tableName: 'nomination',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    date: {
      type: 'date',
    },
    nominationLevel: {
      type: 'varchar',
      enum: [
        'niebieski',
        'purpurowy',
        'brązowy',
        'czarny',
        'żółty',
        'pomarańczowy',
        'zielony',
        '1 belka',
        '2 belki',
        '3 belki',
        '4 belki',
      ],
    },
    nominationType: {
      type: 'varchar',
    },
    description: {
      type: 'varchar',
    },
  },
  relations: {
    nominatedPerson: {
      target: 'User',
      type: 'many-to-one',
    },
  },
});
