const { body, validationResult } = require('express-validator');

exports.validateAddCompetitorReq = [
  body('firstname', 'firstname property is required').not().isEmpty(),
  body('lastname', 'lastname property is required').not().isEmpty(),
  body('isAdult', 'isAdult property is required').exists(),
  body('belt', 'belt property is required').exists(),
  body('belt', 'belt has to be from predefined list').isIn([
    'biały',
    'niebieski',
    'purpurowy',
    'brązowy',
    'czarny',
    'żółty',
    'pomarańczowy',
    'zielony',
  ]),
  body('stripes', 'stripes property is required').exists(),
  body('stripes', 'stripes has to be from predefined list').isIn(['0', '1', '2', '3', '4']),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];
