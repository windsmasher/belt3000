const express = require('express');
const router = express.Router();
const { validateNewGymWithAccount } = require('./newGymWithAccount.middleware');
const { validateRequestForNewGym } = require('./requestForNewGym.middleware');
const withAuth = require('../auth/auth.middleware');
const bcrypt = require('bcrypt');
const { getConnection } = require('typeorm');

router.get('/all', async (req, res, next) => {
  const gymRepository = getConnection().getRepository('Gym');
  const gyms = await gymRepository.find({});

  return res.status(200).json(gyms.map(gym => ({ id: gym.id, name: gym.name, city: gym.city })));
});

router.get('/mine', withAuth, async (req, res, next) => {
  const userRepository = getConnection().getRepository('User');

  const user = await userRepository.findOne({ where: { email: req.email }, relations: ['gyms'] });
  console.log(user);
  if (!user || !user.gyms || user.gyms.length === 0) {
    return res.status(400).json();
  }

  return res.status(200).json(user.gyms);
});

router.get('/details', withAuth, async (req, res, next) => {
  const userRepository = getConnection().getRepository('User');

  const user = await userRepository.findOne({ where: { email: req.email }, relations: ['currentGym'] });

  if (!user || !user.currentGym) {
    return res.status(400).json();
  }

  return res.status(200).json(user.currentGym);
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
    console.log(newUser);
    newGym = await gymRepository.save({
      name: newGymName,
      isAccepted: false,
      mainAdmin: newUser,
      users: [newUser],
    });
    newUser.currentGym = newGym;
    await userRepository.save(newUser);
  } catch (e) {
    return next(e.toString());
  }
  return res.status(201).json(newGym);
});

router.post('/request-for-new-gym', withAuth, validateRequestForNewGym, async (req, res, next) => {
  const userRepository = getConnection().getRepository('User');
  const gymRepository = getConnection().getRepository('Gym');

  const { name } = req.body;

  const user = await userRepository.findOne({ where: { email: req.email }, relations: ['gyms'] });
  if (!user || !user.gyms) {
    return res.status(400).json();
  }

  if (user.gyms.length >= 3) {
    return res.status(400).json({ errorMsg: 'Nie można posiadać więcej niż 3 kluby.' });
  }

  let newGym = null;
  try {
    newGym = await gymRepository.save({
      name: name,
      isAccepted: false,
      mainAdmin: user,
      users: [user],
    });
  } catch (e) {
    return next(e.toString());
  }
  return res.status(200).json(newGym);
});

router.delete('/remove-not-accepted/:id', withAuth, async (req, res, next) => {
  if (!req?.params?.id) {
    return res.status(400).json('Invalid param.');
  }

  const userRepository = getConnection().getRepository('User');
  const gymRepository = getConnection().getRepository('Gym');

  const userMe = await userRepository.findOne({ where: { email: req.email }, relations: ['gyms'] });
  if (!userMe || !userMe.gyms) {
    return res.status(400).json();
  }

  const gym = await gymRepository.findOne({ where: { id: req.params.id } });
  if (!gym) {
    return res.status(400).json();
  }
  if (!userMe.gyms.map(gym => gym.id).includes(gym.id)) {
    return res.status(400).json({ errorMsg: 'Ten klub nie należy do Twoich klubów.' });
  }
  if (gym.isAccepted === true) {
    return res.status(400).json({ errorMsg: 'Nie można usunąć zaakceptowanego klubu.' });
  }

  await gymRepository.remove(gym);
  return res.status(200).json();
});

module.exports = router;
