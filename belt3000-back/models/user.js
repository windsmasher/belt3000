const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    min: 3,
  },
  lastname: {
    type: String,
    required: true,
    unique: true,
  },
  isAdult: {
    type: Boolean,
    required: true,
  },
  belt: {
    type: String,
    enum: ['biały', 'niebieski', 'purpurowy', 'brązowy', 'czarny', 'żółty', 'pomarańczowy', 'zielony'],
    required: true,
  },
  stripes: {
    type: Number,
    min: 0,
    max: 4,
    required: true,
  },
});

const User = (module.exports = mongoose.model('User', UserSchema));
