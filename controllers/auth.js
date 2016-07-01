var express = require('express');
var db = require('../models');
var passport = require('../config/ppConfig');
var router = express.Router();

router.get('/signup', function(req, res) {
  res.render('auth/signup');
});

router.post('/signup', function(req, res) {
  db.user.findOrCreate({
    where: {
      email: req.body.email
    },
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  }).spread(function(user, created) {
    if (created) {
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'User created. You are logged in.'
      })(req, res);
    } else {
      console.log('User already exists with that email.');
      req.flash('error', 'User already exists with that email.');
      res.redirect('/auth/signup');
    }
  }).catch(function(error) {
    console.log('error occurred', error.message);
    req.flash('error', 'Fill all fields.');
    res.redirect('/auth/signup');
  });
});

router.get('/login', function(req, res) {
  successFlash: 'Log in!',
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  successFlash: 'Welcome!',
  failureRedirect: '/auth/login',
  failureFlash: 'You entered your username or password incorrectly.'
}));

router.get('/logout', function(req, res) {
  successFlash: 'You logged out!',
  req.logout();
  res.redirect('/');
});

module.exports = router;
