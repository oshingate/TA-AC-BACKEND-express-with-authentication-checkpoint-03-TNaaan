let passport = require('passport');
let User = require('../models/User');

var GitHubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;

//github strategy

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: '/auth/github/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      let data = profile._json;
      var userData = {
        name: data.name,
        email: data.twitter_username,
        country: data.location,
        age: 24,
        password: data.twitter_username,
      };

      User.findOne({ email: userData.email }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          User.create(userData, (err, createdUser) => {
            if (err) return done(err);
            done(null, createdUser);
          });
        }
        done(null, user);
      });
    }
  )
);

//google strategy

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      let data = profile._json;
      var userData = {
        name: data.name,
        email: data.sub,
        country: data.locale,
        age: 24,
        password: data.name,
      };

      User.findOne({ email: userData.email }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          User.create(userData, (err, createdUser) => {
            if (err) return done(err);
            done(null, createdUser);
          });
        }
        done(null, user);
      });
    }
  )
);

//serializer

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
