const express = require('express');
const router = express.Router();

router.get('/nominations', async (req, res) => {
  res.render('nominations');
});

module.exports = router;
