const express = require('express');
const router = express.Router();
const { getConnection } = require('typeorm');
const withAuth = require('../auth/auth.middleware');
const { validateAddAdmin } = require('./addAdmin.middleware');
const bcrypt = require('bcrypt');

router.patch('/currentGym/:gymId', withAuth, async (req, res, next) => {
  if (!req?.params?.gymId) {
    return res.status(400).json('Invalid param.');
  }

  const userRepository = getConnection().getRepository('User');
  const gymRepository = getConnection().getRepository('Gym');

  const user = await userRepository.findOne({ where: { email: req.email }, relations: ['currentGym', 'gyms'] });

  if (!user || !user.currentGym || !user.gyms) {
    return res.status(400).json();
  }

  const gym = await gymRepository.findOne({ where: { id: req.params.gymId } });
  if (!gym) {
    return res.status(400).json();
  }
  if (!user.gyms.map(gym => gym.id).includes(gym.id)) {
    return res.status(400).json({ errorMsg: 'Ten klub nie należy do Twoich klubów.' });
  }

  user.currentGym = gym;
  await userRepository.save(user);
  return res.status(200).json(gym);
});

router.post('/add-admin', withAuth, validateAddAdmin, async (req, res, next) => {
  const userRepository = getConnection().getRepository('User');
  const email = req.body.email;
  const generatedPassword = Math.random().toString(20).substr(2, 6);

  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(generatedPassword, 10, (err, hash) => {
      if (err) {
        reject(err);
      }
      resolve(hash);
    });
  });

  const existingUser = await userRepository.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ errorMsg: 'Użytkownik z podanym adresem email już istnieje.' });
  }

  const userMe = await userRepository.findOne({ where: { email: req.email }, relations: ['currentGym'] });
  if (!userMe?.currentGym) {
    return res.status(400).json();
  }

  let newUser = null;
  try {
    newUser = await userRepository.save({
      firstname: '',
      lastname: '',
      password: hashedPassword,
      email,
      generatedPassword,
      role: 0,
      gyms: [userMe.currentGym],
      currentGym: userMe.currentGym,
    });
  } catch (e) {
    return next(e.toString());
  }

  return res.status(200).json(newUser);
});

router.get('/list-from-gym-except-me', withAuth, async (req, res, next) => {
  const userRepository = getConnection().getRepository('User');
  const gymRepository = getConnection().getRepository('Gym');

  const userMe = await userRepository.findOne({ where: { email: req.email }, relations: ['currentGym'] });
  if (!userMe?.currentGym) {
    return res.status(400).json();
  }

  const allUsers = await userRepository.find({ relations: ['gyms'] });
  const usersFromGymExceptMe = allUsers.filter(
    user => user.id !== userMe.id && user.gyms.map(gym => gym.id).includes(userMe.currentGym.id),
  );

  return res.status(200).json(usersFromGymExceptMe);
});

module.exports = router;
