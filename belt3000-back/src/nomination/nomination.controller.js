const express = require('express');
const router = express.Router();
const { validateAddNomination } = require('./addNomination.middleware');
const utils = require('./nomination.utils');
const { getConnection } = require('typeorm');
const { isBefore } = require('date-fns');

router.post('/add/:competitorId', validateAddNomination, async (req, res, next) => {
  const nominationRepository = getConnection().getRepository('Nomination');
  const userRepository = getConnection().getRepository('User');

  if (!req || !req.params || !req.params.competitorId) {
    return res.status(400).json('Invalid param.');
  }

  const lastNomination = await nominationRepository.findOne({
    where: { nominatedPerson: { id: req.params.competitorId } },
    relations: ['nominatedPerson'],
    order: { date: 'DESC' },
  });
  const lastBeltNomination = await nominationRepository.findOne({
    where: { nominatedPerson: { id: req.params.competitorId }, nominationType: 0 },
    relations: ['nominatedPerson'],
    order: { date: 'DESC' },
  });

  if (lastNomination && isBefore(new Date(req.body.date), new Date(lastNomination.date))) {
    return res.status(500).json({ errorMsg: 'Data nie może być wcześniejsza od ostatniej daty nominacji' });
  }

  if (lastBeltNomination.nominationLevel === 'czarny' && Number(req.body.nominationType) === 0) {
    return res.status(500).json({ errorMsg: 'Ta osoba ma już czarny pas' });
  }

  let competitor;
  let nomination;

  try {
    competitor = await userRepository.findOne({ id: req.params.competitorId });
  } catch (e) {
    return next(e.toString());
  }
  if (!competitor) {
    return res.status(500).json('No such object with this id.');
  }

  const { date, description } = req.body;
  const nominationType = Number(req.body.nominationType);

  if (nominationType === 0) {
    const newBelt = utils.higherBelt(competitor.belt.replace(' ', ''), competitor.isAdult);

    if (competitor.belt === 'zielony') {
      competitor.isAdult = true;
    }
    competitor.belt = newBelt;
    competitor.stripes = 0;

    nomination = nominationRepository.create({
      date,
      description,
      nominationLevel: newBelt,
      nominationType,
      nominatedPerson: competitor,
    });
  } else {
    competitor.stripes += nominationType;
    if (competitor.stripes > 4) {
      return res.status(400).json({ errorMsg: 'Ta osoba ma już cztery belki' });
    }
    nomination = nominationRepository.create({
      date,
      description,
      nominationLevel:
        nominationType === 1
          ? '1 belka'
          : nominationType === 2
          ? '2 belki'
          : nominationType === 3
          ? '3 Belki'
          : '4 belki',
      nominationType,
      nominatedPerson: competitor,
    });
  }

  try {
    await nominationRepository.save(nomination);
    await userRepository.save(competitor);
  } catch (err) {
    return next(err);
  }
  return res.status(201).json(nomination);
});

router.get('/by-competitor/:competitorId', async (req, res, next) => {
  const nominationRepository = getConnection().getRepository('Nomination');
  if (!req || !req.params || !req.params.competitorId) {
    return res.status(400).json('Invalid param.');
  }

  try {
    const nominations = await nominationRepository.find({
      where: { nominatedPerson: { id: req.params.competitorId } },
      relations: ['nominatedPerson'],
    });
    if (!nominations) {
      return res.status(500).json('No such object with this id.');
    }
    return res.status(200).json(
      nominations
        .map(n => ({
          id: n.id,
          nomination: n.nominationLevel,
          description: n.description,
          date: n.date,
          person: `${n.nominatedPerson.firstname} ${n.nominatedPerson.lastname}`,
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    );
  } catch (e) {
    return next(e.toString());
  }
});

router.get('/all', async (req, res, next) => {
  const nominationRepository = getConnection().getRepository('Nomination');
  try {
    const nominations = await nominationRepository.find({ relations: ['nominatedPerson'] });
    if (!nominations || nominations.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(
      nominations
        .map(n => ({
          id: n.id,
          nomination: n.nominationLevel,
          description: n.description,
          date: n.date,
          person: `${n.nominatedPerson.firstname} ${n.nominatedPerson.lastname}`,
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    );
  } catch (err) {
    return next(err);
  }
});

router.delete('/previous/:competitorId', async (req, res, next) => {
  const nominationRepository = getConnection().getRepository('Nomination');
  const userRepository = getConnection().getRepository('User');
  if (!req || !req.params || !req.params.competitorId) {
    return res.status(400).json('Invalid param.');
  }

  const competitor = await userRepository.findOne({ id: req.params.competitorId });

  const nominationToDelete = await nominationRepository.findOne({
    where: { nominatedPerson: { id: req.params.competitorId } },
    relations: ['nominatedPerson'],
    order: { date: 'DESC' },
  });

  if (nominationToDelete.nominationType === 0) {
    const previousBelt = utils.lowerBelt(nominationToDelete.nominationLevel, competitor.isAdult);
    competitor.belt = previousBelt;
    if (previousBelt === 'zielony') {
      competitor.isAdult = false;
    }
  } else {
    competitor.stripes -= Number(nominationToDelete.nominationType);
  }

  try {
    await userRepository.save(competitor);
    await nominationRepository.remove(nominationToDelete);
  } catch (err) {
    return next(err);
  }
  return res.status(200).json();
});

module.exports = router;
