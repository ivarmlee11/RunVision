var express = require('express');
var db = require('../models');
var passport = require('../config/ppConfig');
var router = express.Router();

router.put('/username', function(req, res) {
  var usernameToUpdate = req.body.name;
  db.user.update({
    name:usernameToUpdate
  },
  { where: {
    id: req.user.id
  }
  }).then(function(user) {
  res.send({message: 'success'});
});
});

module.exports = router;
