const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

mongoose.connect('mongodb://root:root123@ds245927.mlab.com:45927/pug-node');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const user = require('./routes/user');
const nomination = require('./routes/nomination');
app.use('/', user);
app.use('/', nomination);
// app.use(function (err, req, res, next) {
//   console.error(err.stack);
//   res.status(500).send('Something broke! hahahaha');
// });

app.get('/', (req, res) => {
  res.render('index');
});

const PORT = 3001;
app.listen(PORT, () => console.log('Server started on port ' + PORT));
