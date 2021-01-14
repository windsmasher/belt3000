const express = require('express');
const router = express.Router();
const { validateAddCompetitor } = require('./addCompetitor.middleware');
const withAuth = require('../auth/auth.middleware');

router.get('/all', withAuth, async (req, res) => {
  const competitors = await Competitor.find({});

  return res.status(200).json(competitors);
});

router.get('/one/:id', withAuth, async (req, res) => {
  if (!req || !req.params || !req.params.id) {
    return res.status(400).json('Invalid param.');
  }
  const competitor = await Competitor.findById(req.params.id);

  return res.status(200).json(competitor);
});

router.delete('/:id', withAuth, async (req, res) => {
  if (!req || !req.params || !req.params.id) {
    return res.status(400).json('Invalid param.');
  }

  await Competitor.findOneAndDelete({ _id: req.params.id });
  return res.status(200).send();
});

router.patch('/:id', withAuth, validateAddCompetitor, async (req, res, next) => {
  if (!req || !req.params || !req.params.id) {
    return res.status(400).json('Invalid param.');
  }

  const competitor = await Competitor.findById(req.params.id);
  competitor.firstname = req.body.firstname;
  competitor.lastname = req.body.lastname;
  competitor.isAdult = Boolean(req.body.isAdult);
  competitor.belt = req.body.belt;
  competitor.stripes = Number(req.body.stripes);

  try {
    await competitor.save();
  } catch (e) {
    return next(e.toString());
  }

  return res.status(200).json(competitor);
});

router.post('/add', withAuth, validateAddCompetitor, async (req, res, next) => {
  const newCompetitor = new Competitor();
  newCompetitor.firstname = req.body.firstname;
  newCompetitor.lastname = req.body.lastname;
  newCompetitor.isAdult = Boolean(req.body.isAdult);
  newCompetitor.belt = req.body.belt;
  newCompetitor.stripes = Number(req.body.stripes);

  try {
    await newCompetitor.save();
  } catch (e) {
    return next(e.toString());
  }
  return res.status(201).json(newCompetitor);
});

module.exports = router;
