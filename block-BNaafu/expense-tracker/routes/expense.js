var express = require('express');
var passport = require('passport');
var User = require('../models/User');
var Income = require('../models/Income');
var Expense = require('../models/Expense');
var router = express.Router();

/* add new expense. */
router.get('/new', function (req, res, next) {
  res.render('expenseForm');
});

router.post('/new', (req, res, next) => {
  let data = req.body;
  data.createdBy = req.user._id;
  let arr = data.category.split(',');
  data.category = arr;
  Expense.create(data, (err, created) => {
    if (err) return next(err);
    User.findByIdAndUpdate(
      req.user.id,
      { $push: { expenses: created.id } },
      (err, user) => {
        if (err) return next(err);
        res.redirect('/home');
      }
    );
  });
});

module.exports = router;
