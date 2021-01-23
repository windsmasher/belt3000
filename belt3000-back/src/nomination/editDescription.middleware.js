const { body, validationResult } = require('express-validator');

exports.validateEditDescription = [
  body('description', 'description property is required').exists(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];
