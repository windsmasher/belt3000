const express = require('express');
const router = express.Router();
const Competitor = require('../competitor/competitor.model');
const { validateAddNomination } = require('./addNomination.middleware');
const higherBelt = require('./nomination.utils');
const lowerBelt = require('./nomination.utils');

router.post('/add/:competitorId', validateAddNomination, async (req, res, next) => {
  if (!req || !req.params || !req.params.competitorId) {
    return res.status(400).json('Invalid param.');
  }

  let competitor = null;
  try {
    competitor = await Competitor.findById(req.params.competitorId);
  } catch (e) {
    return next(e.toString());
  }
  if (!competitor) {
    return res.status(500).json('No such object with this id.');
  }

  const { date, nominationType, description } = req.body;

  if (nominationType === 0) {
    const newBelt = higherBelt(competitor.belt, competitor.isAdult);
    if (competitor.belt === 'zielony') {
      competitor.isAdult = true;
    }
    competitor.belt = newBelt;
    competitor.stripes = 0;
    competitor.nomination.push({
      date,
      description,
      nomination: newBelt,
    });
  } else {
    competitor.stripes += nominationType;
    if (competitor.stripes > 4) {
      return res.status(400).json('Too many stripes.');
    }
    competitor.nomination.push({
      date,
      description,
      nomination:
        nominationType === 1
          ? '1 belka'
          : nominationType === 2
          ? '2 belki'
          : nominationType === 3
          ? '3 Belki'
          : '4 belki',
    });
  }

  try {
    await competitor.save();
  } catch (err) {
    return next(err);
  }
  return res.status(201).json(competitor);
});

router.get('/by-competitor/:competitorId', async (req, res, next) => {
  if (!req || !req.params || !req.params.competitorId) {
    return res.status(400).json('Invalid param.');
  }

  try {
    const competitor = await Competitor.findById(req.params.competitorId);
    if (!competitor) {
      return res.status(500).json('No such object with this id.');
    }
    return res.status(200).json(competitor.nomination);
  } catch (e) {
    return next(e.toString());
  }
});

router.delete('/previous/:competitorId', async (req, res, next) => {
  if (!req || !req.params || !req.params.competitorId) {
    return res.status(400).json('Invalid param.');
  }

  const competitor = await Competitor.findById(req.params.competitorId);
  const nominationToDelete = competitor.nomination.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  })[0];

  if (nominationToDelete.nomination === 0) {
    const previousBelt = lowerBelt(nominationToDelete.nomination, competitor.isAdult);
    competitor.belt = previousBelt;
  } else {
  }

  return res.json(nominationToDelete);
});

module.exports = router;
