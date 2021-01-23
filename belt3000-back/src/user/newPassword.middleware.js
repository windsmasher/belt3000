const { body, validationResult } = require('express-validator');

exports.validateNewPassword = [
  body('oldPassword', 'oldPassword property is required').not().isEmpty(),
  body('newPassword1', 'newPassword1 property is required').not().isEmpty(),
  body('newPassword2', 'newPassword2 property is required').not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];
