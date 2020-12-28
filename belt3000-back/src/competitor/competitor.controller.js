const express = require('express');
const router = express.Router();
const Competitor = require('./competitor.model');
const { validateAddCompetitor } = require('./addCompetitor.middleware');
const withAuth = require('../auth/auth.middleware');

router.get('/all', withAuth, async (req, res) => {
  const competitors = await Competitor.find({});
  console.log(competitors);
  return res.json(competitors);
});

router.delete('/:id', withAuth, async (req, res) => {
  await Competitor.findOneAndDelete({ _id: req.params.id });
  return res.status(200).send();
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
