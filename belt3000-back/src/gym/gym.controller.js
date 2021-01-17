const express = require('express');
const router = express.Router();
const { validateNewGymWithAccount } = require('./newGymWithAccount.middleware');
const { validateNewGymWithExistingAccount } = require('./newGymWithExistingAccount.middleware');
const { withAuth } = require('../auth/auth.middleware');
const bcrypt = require('bcrypt');
const { getConnection } = require('typeorm');

router.get('/all', async (req, res, next) => {
  const gymRepository = getConnection().getRepository('Gym');
  const gyms = await gymRepository.find({});

  return res.status(200).json(gyms.map(gym => ({ id: gym.id, name: gym.name, city: gym.city })));
});

router.get('/details', withAuth, async (req, res, next) => {
  return null;
});

router.post('/new-gym-with-new-account', validateNewGymWithAccount, async (req, res, next) => {
  const userRepository = getConnection().getRepository('User');
  const gymRepository = getConnection().getRepository('Gym');

  const { newGymName, firstname, lastname, password, email } = req.body;

  const existingUser = await userRepository.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ errorMsg: 'Użytkownik z podanym adresem email już istnieje.' });
  }

  const existingGym = await gymRepository.findOne({ name: newGymName });
  if (existingGym) {
    return res.status(400).json({ errorMsg: 'Klub z podaną nazwą już istnieje' });
  }

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        reject(err);
      }
      resolve(hash);
    });
  });

  let newGym = null;
  let newUser = null;
  try {
    newUser = await userRepository.save({
      firstname,
      lastname,
      password: hashedPassword,
      email,
      role: 0,
    });
    newGym = await gymRepository.save({
      name: newGymName,
      isAccepted: false,
      mainAdmin: newUser,
      users: [newUser],
    });
    await userRepository.save({ defaultGym: newGym });
  } catch (e) {
    return next(e.toString());
  }
  return res.status(201).json(newGym);
});

module.exports = router;
