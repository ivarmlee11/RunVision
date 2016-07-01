var express = require('express');
var db = require('../models');
var passport = require('../config/ppConfig');
var router = express.Router();
var flash = require('connect-flash');
var isLoggedIn = require('../middleware/isLoggedIn');

router.post('/clientData', function(req, res) {
  db.run.create({
    userId: req.user.id,
    name: req.body.runName,
    imageArray: req.body.runPathUrlString,
    latlngArray: req.body.runPathString
  }).then(function(data) {
    res.send(data);
  });
});

router.post('/favorite', function(req, res) {
  db.favorites.create({
    userId: req.body.userId,
    runId: req.body.runId
  }).then(function(data) {
    res.send(data);
  });
});

router.get("/showAllRuns", isLoggedIn, function(req, res) {
  db.run.findAll({
  }).then(function(run) {
    res.render('showAllRuns', {run: run});
  });
});

router.get("/showRuns/:idx", function(req, res) {
  db.run.find({
    where: {
      id: req.params.idx
    }
  }).then(function(run) {
    res.render('showRuns', {run: run});
    console.log(run);
  });
});

module.exports = router;

