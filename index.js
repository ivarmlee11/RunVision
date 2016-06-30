var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('./config/ppConfig');
var flash = require('connect-flash');
var isLoggedIn = require('./middleware/isLoggedIn');
var db = require('./models');
var app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.get('/', function(req, res) {
  res.render('splash');
});

app.get('/profile', isLoggedIn, function(req, res) {
  db.favorites.findAll({
    where: {
      userId: req.user.id
    }
  }).then(function(data) {
    var runIdArray = [];
    data.forEach(function(eachFavorite) {
      runIdArray.push(eachFavorite.runId);
    });
    db.run.findAll({
      where: {
        id: runIdArray
      }
    }).then(function(favs) {
      res.render('profile', { favs: favs});
      console.log(favs);
    })
  });
});

app.use('/auth', require('./controllers/auth'));
app.use('/runMaps', require('./controllers/runMaps'));
app.use('/favs', require('./controllers/favs'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
