// middleware to determine if the user is logged in
module.exports = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    req.flash('error', 'You need to log in');
    res.redirect('/auth/login');
  }
};
