const { body, validationResult } = require('express-validator');

exports.validateRequestForNewGym = [
  body('name', 'name of gym is required').not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];
