const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { validateAdminRegister } = require('./register.middleware');
const { getConnection } = require('typeorm');

router.post('/register-admin', validateAdminRegister, async (req, res, next) => {
  const userRepository = getConnection().getRepository('User');

  const { firstname, lastname, password, email } = req.body;

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        reject(err);
      }
      resolve(hash);
    });
  });

  const existingUser = userRepository.find({ email });
  if (existingUser) {
    return res.status(400).json({ errorMsg: 'Użytkownik z podanym adresem email już istnieje.' });
  }

  let newUser = null;
  try {
    newUser = await userRepository.save({ firstname, lastname, password: hashedPassword, email });
  } catch (e) {
    return next(e.toString());
  }
  return res.status(201).json(newUser);
});

module.exports = router;
