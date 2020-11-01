const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();

mongoose.connect('mongodb://root:root123@ds249355.mlab.com:49355/belt3000');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const user = require('./routes/user');
const nomination = require('./routes/nomination');
const admin = require('./routes/admin');
const withAuth = require('./middleware/auth');

app.use('/', user);
app.use('/', nomination);
app.use('/admin/', admin);

// app.use(function (err, req, res, next) {
//   console.error(err.stack);
//   res.status(500).send('Something broke! hahahaha');
// });

app.get('/checkToken', withAuth, (req, res) => {
  res.sendStatus(200);
});

const PORT = 3001;
app.listen(PORT, () => console.log('Server started on port ' + PORT));
