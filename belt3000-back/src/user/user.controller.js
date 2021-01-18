const express = require('express');
const router = express.Router();
const { getConnection } = require('typeorm');
const withAuth = require('../auth/auth.middleware');

router.patch('/currentGym/:gymId', withAuth, async (req, res, next) => {
  if (!req || !req.params || !req.params.gymId) {
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

module.exports = router;
