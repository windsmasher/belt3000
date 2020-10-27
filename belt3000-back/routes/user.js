const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { validateAddCompetitorReq } = require('../middleware/validate-add-competitor-req');

router.get('/competitors', async (req, res) => {
  const competitors = await User.find({});
  res.json(competitors);
});

router.delete('/competitor/:id', async (req, res) => {
  await User.findOneAndDelete({ _id: req.params.id });
  return res.status(200).send();
});

router.post('/add-competitor', validateAddCompetitorReq, async (req, res, next) => {
  const newUser = new User();
  newUser.firstname = req.body.firstname;
  newUser.lastname = req.body.lastname;
  newUser.isAdult = Boolean(req.body.isAdult);
  newUser.belt = req.body.belt;
  newUser.stripes = Number(req.body.stripes);

  try {
    await newUser.save();
  } catch (e) {
    return next(e.toString());
  }
  return res.status(201).json(newUser);
});

module.exports = router;
