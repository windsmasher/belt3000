const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  isAdult: {
    type: Boolean,
    required: true,
  },
});

const User = (module.exports = mongoose.model('User', UserSchema));
