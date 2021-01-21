const express = require('express');
const router = express.Router();
const { validateAddCompetitor } = require('./addCompetitor.middleware');
const withAuth = require('../auth/auth.middleware');
const { getConnection, Not, IsNull } = require('typeorm');

const getCurrentGym = async (req, res, userRepository) => {
  const user = await userRepository.findOne({ where: { email: req.email }, relations: ['currentGym'] });

  if (!user || !user.currentGym) {
    return res.status(400).json();
  }
  return user.currentGym;
};

router.get('/all', withAuth, async (req, res) => {
  const userRepository = getConnection().getRepository('User');
  const currentGym = await getCurrentGym(req, res, userRepository);

  const competitors = await userRepository.find({ where: { belt: Not(IsNull()) }, relations: ['gyms'], role: 0 });
  const competitrsByGym = competitors.filter(competitor => competitor.gyms.map(gym => gym.id).includes(currentGym.id));

  return res.status(200).json(competitrsByGym);
});

router.get('/one/:id', withAuth, async (req, res) => {
  const userRepository = getConnection().getRepository('User');
  if (!req || !req.params || !req.params.id) {
    return res.status(400).json('Invalid param.');
  }
  const competitor = await userRepository.findOne({ where: { id: req.params.id }, relations: ['gyms'] });
  const currentGym = await getCurrentGym(req, res, userRepository);

  if (!competitor.gyms.map(gym => gym.id).includes(currentGym.id)) {
    return res.status(400).json();
  }

  return res.status(200).json(competitor);
});

router.delete('/:id', withAuth, async (req, res) => {
  const userRepository = getConnection().getRepository('User');
  const nominationRepository = getConnection().getRepository('Nomination');
  if (!req || !req.params || !req.params.id) {
    return res.status(400).json('Invalid param.');
  }

  const user = await userRepository.findOne({ where: { id: req.params.id }, relations: ['gyms'] });

  const currentGym = await getCurrentGym(req, res, userRepository);

  if (!user.gyms.map(gym => gym.id).includes(currentGym.id)) {
    return res.status(400).json();
  }

  const nominations = await nominationRepository.find({
    where: { nominatedPerson: { id: req.params.id } },
    relations: ['nominatedPerson'],
  });

  await nominationRepository.remove(nominations);
  await userRepository.remove(user);

  return res.status(200).send();
});

router.patch('/:id', withAuth, validateAddCompetitor, async (req, res, next) => {
  const userRepository = getConnection().getRepository('User');
  if (!req || !req.params || !req.params.id) {
    return res.status(400).json('Invalid param.');
  }

  const competitor = await userRepository.findOne({ where: { id: req.params.id }, relations: ['gyms'] });

  const currentGym = await getCurrentGym(req, res, userRepository);

  if (!competitor.gyms.map(gym => gym.id).includes(currentGym.id)) {
    return res.status(400).json();
  }

  competitor.firstname = req.body.firstname;
  competitor.lastname = req.body.lastname;
  competitor.isAdult = Boolean(req.body.isAdult);
  competitor.belt = req.body.belt;
  competitor.stripes = Number(req.body.stripes);

  try {
    await userRepository.save(competitor);
  } catch (e) {
    return next(e.toString());
  }

  return res.status(200).json(competitor);
});

router.post('/add', withAuth, validateAddCompetitor, async (req, res, next) => {
  const userRepository = getConnection().getRepository('User');
  const currentGym = await getCurrentGym(req, res, userRepository);

  const newCompetitor = userRepository.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    isAdult: Boolean(req.body.isAdult),
    belt: req.body.belt,
    stripes: Number(req.body.stripes),
    gyms: [currentGym],
  });

  try {
    await userRepository.save(newCompetitor);
  } catch (e) {
    return next(e.toString());
  }
  return res.status(201).json(newCompetitor);
});

module.exports = router;
