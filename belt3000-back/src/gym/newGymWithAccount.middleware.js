const { body, validationResult } = require('express-validator');

exports.validateNewGymWithAccount = [
  body('name', 'name of gym is required').not().isEmpty(),
  body('firstname', 'firstname property is required').not().isEmpty(),
  body('lastname', 'lastname property is required').not().isEmpty(),
  body('email', 'email property is required').not().isEmpty(),
  body('email', 'email not valid').isEmail(),
  body('password', 'password property is required').not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];
