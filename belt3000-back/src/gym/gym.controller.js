const express = require('express');
const router = express.Router();
const Gym = require('./gym.model');
const { validateNewGymWithAccount } = require('./newGymWithAccount.middleware');
const { validateNewGymWithExistingAccount } = require('./newGymWithExistingAccount.middleware');
const { withAuth } = require('../auth/auth.middleware');
const bcrypt = require('bcrypt');

router.post('/new-gym-with-new-account', validateNewGymWithAccount, async (req, res, next) => {
  const { name, firstname, lastname, password, email } = req.body;

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        reject(err);
      }
      resolve(hash);
    });
  });

  const gym = new Gym({ name, isAccepted: false, admins: [{ firstname, lastname, password: hashedPassword, email }] });
  try {
    await gym.save();
  } catch (e) {
    return next(e.toString());
  }
  return res.status(201).json(gym);
});

router.post('/add-gym-to-existing-account/', validateNewGymWithExistingAccount, async (req, res, next) => {
  const { name } = req.body;
  return res.json(req);
});

module.exports = router;
