const mongoose = require('mongoose');

const GymSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
  },
  isAccepted: {
    type: Boolean,
    required: true,
  },
  admins: {
    type: [
      {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
      },
    ],
  },
  competitors: {
    type: [
      {
        firstname: {
          type: String,
          required: true,
          min: 3,
        },
        lastname: {
          type: String,
          required: true,
        },
        isAdult: {
          type: Boolean,
          required: false,
        },
        belt: {
          type: String,
          enum: ['biały', 'niebieski', 'purpurowy', 'brązowy', 'czarny', 'żółty', 'pomarańczowy', 'zielony'],
          required: false,
        },
        stripes: {
          type: Number,
          min: 0,
          max: 4,
          required: false,
        },
        nomination: {
          type: [
            {
              date: Date,
              nomination: {
                type: String,
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
              description: String,
              type: {
                type: Number,
                enum: [0, 1, 2, 3, 4],
              },
            },
          ],
        },
      },
    ],
  },
});

const Gym = (module.exports = mongoose.model('Gym', GymSchema));
