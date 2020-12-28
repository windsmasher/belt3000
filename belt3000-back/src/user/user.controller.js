const { validateAdminRegister } = require('./register.middleware');
const User = require('./user.model');
const express = require('express');
const router = express.Router();

router.post('/register-admin', validateAdminRegister, async (req, res, next) => {
  const { firstname, lastname, password, email } = req.body;
  const newUser = new User({ firstname, lastname, password, email });

  try {
    await newUser.save();
  } catch (e) {
    return next(e.toString());
  }
  return res.status(201).json(newUser);
});

module.exports = router;
