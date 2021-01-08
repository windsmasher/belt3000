const { body, validationResult } = require('express-validator');

exports.validateAddNomination = [
  body('date', 'date property is required').exists().isDate(),
  body('nominationType', 'nomination property is required').exists(),
  body('nominationType', 'nomination has to be from predefined list').isIn(['0', '1', '2', '3', '4']), // 0 for belt and higher for stripes number
  body('description', 'description property is required').exists(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];
