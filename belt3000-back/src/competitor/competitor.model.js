const mongoose = require('mongoose');

const CompetitorSchema = mongoose.Schema({
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
});

const Competitor = (module.exports = mongoose.model('Competitor', CompetitorSchema));
