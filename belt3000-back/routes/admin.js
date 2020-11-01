const { validateAdminRegister } = require('../middleware/validate-admin-register');
const Admin = require('../models/admin.model');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/register-admin', validateAdminRegister, async (req, res, next) => {
  const { firstname, lastname, password, email } = req.body;
  const newAdmin = new Admin({ firstname, lastname, password, email });

  try {
    await newAdmin.save();
  } catch (e) {
    return next(e.toString());
  }
  return res.status(201).json(newAdmin);
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  Admin.findOne({ email }, (err, admin) => {
    if (err) {
      console.error(err);
      res.status(500).json({
        error: 'Internal error please try again',
      });
    } else if (!admin) {
      res.status(401).json({
        error: 'Incorrect email or password',
      });
    } else {
      admin.isCorrectPassword(password, (err, same) => {
        if (err) {
          res.status(500).json({
            error: 'Internal error please try again',
          });
        } else if (!same) {
          res.status(401).json({
            error: 'Incorrect email or password',
          });
        } else {
          // Issue token
          const payload = { email };
          const token = jwt.sign(payload, process.env.SECRET, {
            expiresIn: '1h',
          });
          return res.cookie('token-belt', token, { httpOnly: true }).sendStatus(200);
        }
      });
    }
  });
});

module.exports = router;
