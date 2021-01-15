const express = require('express');
const router = express.Router();
const { validateAddCompetitor } = require('./addCompetitor.middleware');
const withAuth = require('../auth/auth.middleware');
const { getConnection, Not, IsNull } = require('typeorm');

router.get('/all', withAuth, async (req, res) => {
  const userRepository = getConnection().getRepository('User');
  const competitors = await userRepository.find({ belt: Not(IsNull()) });

  return res.status(200).json(competitors);
});

router.get('/one/:id', withAuth, async (req, res) => {
  const userRepository = getConnection().getRepository('User');
  if (!req || !req.params || !req.params.id) {
    return res.status(400).json('Invalid param.');
  }
  const competitor = await userRepository.findOne({ id: req.params.id });

  return res.status(200).json(competitor);
});

router.delete('/:id', withAuth, async (req, res) => {
  const userRepository = getConnection().getRepository('User');
  if (!req || !req.params || !req.params.id) {
    return res.status(400).json('Invalid param.');
  }

  const user = await userRepository.findOne({ id: req.params.id });
  await userRepository.remove(user);

  return res.status(200).send();
});

router.patch('/:id', withAuth, validateAddCompetitor, async (req, res, next) => {
  const userRepository = getConnection().getRepository('User');
  if (!req || !req.params || !req.params.id) {
    return res.status(400).json('Invalid param.');
  }

  const competitor = await userRepository.findOne({ id: req.params.id });
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
  const newCompetitor = userRepository.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    isAdult: Boolean(req.body.isAdult),
    belt: req.body.belt,
    stripes: Number(req.body.stripes),
  });

  try {
    await userRepository.save(newCompetitor);
  } catch (e) {
    return next(e.toString());
  }
  return res.status(201).json(newCompetitor);
});

module.exports = router;
