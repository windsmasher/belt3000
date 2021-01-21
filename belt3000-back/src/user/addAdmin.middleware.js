const { body, validationResult } = require('express-validator');

exports.validateAddAdmin = [
  body('email', 'email property is required').not().isEmpty(),
  body('email', 'email not valid').isEmail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];
