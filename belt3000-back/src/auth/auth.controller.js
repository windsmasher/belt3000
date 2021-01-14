const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  let user = null;
  try {
    const gyms = await Gym.find({ admins: { $elemMatch: { email: email } } });
    if (gyms && gyms.length > 0 && gyms[0].admins) {
      user = gyms[0].admins.find(admin => admin.email === email);
    }
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
