const express = require('express');
const router = express.Router();

router.post('/add/:competitorId', async (req, res) => {
  res.render('nominations');
});

module.exports = router;
