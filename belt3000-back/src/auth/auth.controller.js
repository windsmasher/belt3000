const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const User = require('../user/user.model');

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  let user = null;

  try {
    user = await User.findOne({ email });
  } catch (e) {
    next(e);
  }
  if (!user) {
    return res.status(401).json({
      error: 'Incorrect email or password',
    });
  }

  try {
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch === false) {
      return res.status(401).json({
        error: 'Incorrect email or password',
      });
    }
  } catch (e) {
    next(e);
  }

  const payload = { email };
  const token = jwt.sign(payload, process.env.SECRET, {
    expiresIn: '1h',
  });
  return res.status(200).json({ token: token });
});

module.exports = router;
