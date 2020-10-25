const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { body, validationResult } = require('express-validator');

router.get('/competitors', async (req, res) => {
  const competitors = await User.find({});
  res.json(competitors);
});

router.delete('/competitor/:id', async (req, res) => {
  await User.findOneAndDelete({ _id: req.params.id });
  res.status(200);
});

router.post(
  '/add-competitor',
  [
    body('firstname', 'firstname is required').not().isEmpty(),
    body('lastname', 'lastname is required').not().isEmpty(),
    body('isAdult', 'isAdult is required').exists(),
  ],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }

    const newUser = new User();
    newUser.firstname = req.body.firstname;
    newUser.lastname = req.body.lastname;
    newUser.isAdult = Boolean(req.body.isAdult);
    try {
      await newUser.save();
    } catch (e) {
      console.log(e);
      res.status(500);
      return;
    }
    console.log(newUser);
    return res.status(201).json(newUser);
  },
);

module.exports = router;
