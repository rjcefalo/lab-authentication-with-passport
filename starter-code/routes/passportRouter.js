const express = require('express');

const passportRouter = express.Router();
// Require user model
// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
// Add passport
const passport = require('passport');
const mongoose = require('mongoose');
const flash = require('connect-flash');

const ensureLogin = require('connect-ensure-login');
const User = require('../models/user');

mongoose.connect('mondodb://localhost/Users');

passportRouter.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

passportRouter.get('/signup', (req, res) => {
  res.render('passport/signup');
});

passportRouter.post('/signup', (req, res) => {
  const { username, password } = req.body;
  if (username === '' || password === '') {
    res.redirect('signup');
  }
  const saltRounds = 5;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  const newUser = new User({
    username,
    password: hash,
  });
  newUser.save()
    .then(() => {
      res.redirect('/login');
    })
    .catch((err) => {
      console.log(err);
    });
});


passportRouter.get('/login', (req, res) => {
  res.render('passport/login', { message: req.flash('error') });
});
passportRouter.post('/login', passport.authenticate('local', {
  successRedirect: '/private-page',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true,
}));

passportRouter.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private');
});
module.exports = passportRouter;
