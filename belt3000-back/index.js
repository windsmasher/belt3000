const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

mongoose.connect('mongodb://root:root123@ds245927.mlab.com:45927/pug-node');

app.set('vies', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-locals'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());

const user = require('./routes/user');
const nomination = require('./routes/nomination');
app.use('/', user);
app.use('/', nomination);

app.get('/', (req, res) => {
  res.render('index');
});

const PORT = 3001;
app.listen(PORT, () => console.log('Server started on port ' + PORT));
