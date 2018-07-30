const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('main');
});

const userMiddleware = (req, res, next) => {
  const { username, birthday } = req.query;
  if (username && birthday) {
    next();
  } else {
    res.redirect('/');
  }
};

app.post('/check', (req, res) => {
  const { username, birthday } = req.body;
  const major = moment().isAfter(moment(birthday).add(18, 'years'));

  if (major) {
    res.redirect(`/major?username=${username}&birthday=${birthday}`);
  } else {
    res.redirect(`/minor?username=${username}&birthday=${birthday}`);
  }
});

app.get('/major', userMiddleware, (req, res) => {
  res.render('major', { username: req.body.username });
});

app.get('/minor', userMiddleware, (req, res) => {
  res.render('minor', { username: req.body.username });
});

app.listen(3000);
