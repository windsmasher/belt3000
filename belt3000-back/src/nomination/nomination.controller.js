const express = require('express');
const router = express.Router();
const Competitor = require('../competitor/competitor.model');
const { validateAddNomination } = require('./addNomination.middleware');
const utils = require('./nomination.utils');

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

  const { date, description } = req.body;
  const nominationType = Number(req.body.nominationType);

  if (nominationType === 0) {
    console.log(`to higer belt: ${competitor.belt} and ${competitor.isAdult}`);
    const newBelt = utils.higherBelt(competitor.belt.replace(' ', ''), competitor.isAdult);
    console.log('higer belt: ', newBelt);

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
    return res.status(200).json(
      competitor.nomination
        .map(n => ({
          id: n.id,
          nomination: n.nomination,
          description: n.description,
          date: n.date,
          person: `${competitor.firstname} ${competitor.lastname}`,
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    );
  } catch (e) {
    return next(e.toString());
  }
});

router.get('/all', async (req, res, next) => {
  try {
    const competitors = await Competitor.find({});
    if (!competitors || competitors.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(
      competitors
        .reduce(
          (prev, curr) =>
            prev.concat(
              curr.nomination.map(n => ({
                id: n.id,
                nomination: n.nomination,
                description: n.description,
                date: n.date,
                person: `${curr.firstname} ${curr.lastname}`,
              })),
            ),
          [],
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    );
  } catch (err) {
    return next(err);
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
    const previousBelt = utils.lowerBelt(nominationToDelete.nomination, competitor.isAdult);
    competitor.belt = previousBelt;
    if (previousBelt === 'zielony') {
      competitor.isAdult = false;
    }
  } else {
    competitor.stripes -= nominationToDelete.nomination;
  }

  competitor.nomination = competitor.nomination.filter(nom => nom.id !== nominationToDelete.id);
  try {
    await competitor.save();
  } catch (err) {
    return next(err);
  }
  return res.status(200);
});

module.exports = router;
