var express = require('express');
var db = require('../models');
var passport = require('../config/ppConfig');
var router = express.Router();

router.delete('/deleteRun/:runId', function(req, res) {
  db.favorites.destroy({
    where: {
      userId: req.user.id,
      runId: req.params.runId
    }
  }).then(function(data) {
    console.log(data);
  });
});

module.exports = router;

