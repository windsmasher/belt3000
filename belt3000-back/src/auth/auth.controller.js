const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const { getConnection } = require('typeorm');

router.post('/login', async (req, res, next) => {
  const userRepository = getConnection().getRepository('User');
  const { email, password } = req.body;
  let user = null;
  try {
    user = await userRepository.findOne({ where: { email: email }, relations: ['gyms', 'defaultGym'] });
    console.log('user => ', user);
  } catch (e) {
    return next(e);
  }
  if (!user) {
    return res.status(401).json({
      error: 'Incorrect email or password',
    });
  }

  if (!user.gyms || user.gyms.length === 0) {
    return res.status(400).json({ errorMsg: 'Użytkownik nie jest przyporządkowany do żadnego klubu' });
  }

  let gymId = null;

  gymId = user.defaultGym && user.defaultGym.isAccepted ? user.defaultGym.id : null;

  if (!gymId) {
    for (const gym of user.gyms) {
      if (gym.id && gym.isAccepted) {
        gymId = gym.id;
      }
    }
  }

  if (!gymId) {
    return res.status(400).json({ errorMsg: 'Klub nie został jeszcze zaakceptowany' });
  }

  try {
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch === false) {
      return res.status(401).json({
        error: 'Incorrect email or password',
      });
    }
  } catch (e) {
    return next(e);
  }

  const payload = { email };
  const token = jwt.sign(payload, process.env.SECRET, {
    expiresIn: '1h',
  });
  return res.status(200).json({ token: token, gymId });
});

module.exports = router;
