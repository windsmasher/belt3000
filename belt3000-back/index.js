const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const typeorm = require('typeorm');
require('dotenv').config();

typeorm
  .createConnection({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_ROOT_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    entities: [
      require('./src/user/user.schema'),
      require('./src/gym/gym.schema'),
      require('./src/nomination/nomination.schema'),
    ],
  })
  .then(function () {
    console.log('Connected to mysql.');
  })
  .catch(function (error) {
    console.log('Error: ', error);
  });

+app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const competitor = require('./src/competitor/competitor.controller');
const nomination = require('./src/nomination/nomination.controller');
const user = require('./src/user/user.controller');
const gym = require('./src/gym/gym.controller');
const auth = require('./src/auth/auth.controller');

const withAuth = require('./src/auth/auth.middleware');

app.use('/competitor/', competitor);
app.use('/nomination/', nomination);
app.use('/user/', user);
app.use('/gym/', gym);
app.use('/auth/', auth);

// app.use(function (err, req, res, next) {
//   console.error(err.stack);
//   res.status(500).send('Something broke! hahahaha');
// });

app.get('/checkToken', withAuth, (req, res) => {
  res.sendStatus(200);
});

const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => console.log('Server started on port ' + PORT));
