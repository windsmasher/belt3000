const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { check, validationResult } = require('express-validator');

router.get('/competitors', async (req, res) => {
  const competitors = await User.find({});
  res.json(competitors);
});

// router.get('/add-competitor', async (req, res) => {
//   res.render('add-competitor');
// });

router.delete('/competitor/:id', async (req, res) => {
  console.log(req.params);
  await User.findOneAndDelete({ _id: req.params.id });
  res.status(200);
});

router.post(
  '/add-competitor',
  // [
  //   check('firstname', 'firstname is required').not().isEmpty(),
  //   check('lastname', 'lastname is required').not().isEmpty(),
  //   check('isAdult', 'isAdult is required').not().isEmpty(),
  // ],
  async (req, res) => {
    const result = validationResult(req);
    var errors = result.errors;
    if (!result.isEmpty()) {
      res.status(400).json(errors);
    }
    const newUser = new User();
    newUser.firstname = req.body.firstname;
    newUser.lastname = req.body.lastname;
    newUser.isAdult = Boolean(req.body.isAdult);
    try {
      await newUser.save();
    } catch (e) {
      console.log(e);
      return;
    }
    return res.status(201);
  },
);

module.exports = router;
