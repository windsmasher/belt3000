const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const { getConnection } = require('typeorm');

router.post('/login', async (req, res, next) => {
  const userRepository = getConnection().getRepository('User');
  const { email, password } = req.body;
  let user = null;
  try {
    user = await userRepository.findOne({ email: email });
  } catch (e) {
    return next(e);
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
    return next(e);
  }

  const payload = { email };
  const token = jwt.sign(payload, process.env.SECRET, {
    expiresIn: '1h',
  });
  return res.status(200).json({ token: token });
});

module.exports = router;
