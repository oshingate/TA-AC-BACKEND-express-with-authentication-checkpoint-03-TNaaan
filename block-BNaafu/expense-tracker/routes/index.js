var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/auth/github', passport.authenticate('github'));

router.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/users/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/home');
  }
);

//google routes

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/users/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/home');
  }
);

module.exports = router;
