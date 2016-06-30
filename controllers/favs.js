var express = require('express');
var db = require('../models');
var passport = require('../config/ppConfig');
var router = express.Router();

router.delete('/deleteFavorites/:id', function(req, res) {
  db.favorites.destroy({
    where: {
      userId: req.user.id,
      runId: req.params.id
    }
  }).done(function(data) {
    res.send({message: 'success'});
  });
});

module.exports = router;

