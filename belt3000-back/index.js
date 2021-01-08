const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();

const uri = 'mongodb+srv://windsmasher:agent007@cluster0.iplom.mongodb.net/belt3000?retryWrites=true&w=majority';
try {
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
    if (err) {
      console.log(err);
      throw new Error(err);
    }
    console.log('Connected to MongoDB.');
  });
} catch (error) {
  console.log('Could not connect to DB.');
}
+app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const competitor = require('./src/competitor/competitor.controller');
const nomination = require('./src/nomination/nomination.controller');
const user = require('./src/user/user.controller');
const auth = require('./src/auth/auth.controller');

const withAuth = require('./src/auth/auth.middleware');

app.use('/competitor/', competitor);
app.use('/nomination/', nomination);
app.use('/user/', user);
app.use('/auth/', auth);

// app.use(function (err, req, res, next) {
//   console.error(err.stack);
//   res.status(500).send('Something broke! hahahaha');
// });

app.get('/checkToken', withAuth, (req, res) => {
  res.sendStatus(200);
});

const PORT = 5001;
app.listen(PORT, () => console.log('Server started on port ' + PORT));
