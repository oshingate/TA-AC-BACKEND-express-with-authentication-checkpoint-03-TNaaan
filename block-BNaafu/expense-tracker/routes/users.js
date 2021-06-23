var express = require('express');
var User = require('../models/User');
var Expense = require('../models/Expense');
var Income = require('../models/Income');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//register user using form
router.get('/register', (req, res, next) => {
  res.render('userRegistrationForm');
});

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, created) => {
    if (err) return next(err);

    res.redirect('/users/login');
  });
});

//login user using form
router.get('/login', (req, res, next) => {
  res.render('userLoginForm');
});

router.post('/login', (req, res, next) => {
  let { email, password } = req.body;
  //if empty data
  if (!email || !password) {
    return res.redirect('/users/login');
  }
  //if no email match
  User.findOne({ email: email }, (err, user) => {
    if (err) return next(err);

    if (!user) {
      return res.redirect('/users/login');
    }

    user.checkPassword(password, function (err, result) {
      if (err) return next(err);

      if (!result) {
        return res.redirect('/users/login');
      }
      req.session.userId = user.id;
      res.redirect('/home');
    });
  });
});

//user logout handler

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  req.user = null;
  res.clearCookie('connect.sid');
  res.redirect('/users/login');
});

//get statement

router.get('/statement/all', (req, res, next) => {
  let newArr = req.user.incomes.concat(req.user.expenses);
  newArr = newArr.sort(function (a, b) {
    if (a.date > b.date) {
      return 1;
    }
    if (a.date < b.date) {
      return -1;
    }
    if ((a.date = b.date)) {
      return 0;
    }
  });

  let totalBalOfMonth = req.user.balance;

  res.render('statementPage', { newArr, totalBalOfMonth });
});

//statement filter by date
router.post('/statement/dateFilter', (req, res, next) => {
  let { from, to } = req.body;
  console.log(from, to);
  Expense.find({ date: { $gte: from, $lt: to } }, (err, expenseArr) => {
    if (err) return next(err);

    Income.find({ date: { $gte: from, $lt: to } }, (err, incomeArr) => {
      if (err) return next(err);

      //caculating saving of month
      let totalExpenseOfMonth = expenseArr.reduce((acc, cv) => {
        acc = acc + cv.amount;
        return acc;
      }, 0);
      let totalIncomeOfMonth = incomeArr.reduce((acc, cv) => {
        acc = acc + cv.amount;
        return acc;
      }, 0);
      let totalBalOfMonth = totalIncomeOfMonth - totalExpenseOfMonth;

      let newArr = incomeArr.concat(expenseArr);
      newArr = newArr.sort(function (a, b) {
        if (a.date > b.date) {
          return 1;
        }
        if (a.date < b.date) {
          return -1;
        }
        if ((a.date = b.date)) {
          return 0;
        }
      });

      res.render('statementPage', { newArr, totalBalOfMonth });
    });
  });
});

//statement filter by month

router.post('/statement/byMonth', (req, res, next) => {
  let month = req.body.month;
  let startDate = month + '-01';

  let arr = month.split('-');

  arr[1] = Number(arr[1]) + 1;
  arr[1] = arr[1].toString();

  if (arr[1].length < 2) {
    arr[1] = '0' + arr[1];
  }

  arr.push('01');

  let endDate = arr.join('-');

  Expense.find(
    { date: { $gte: startDate, $lt: endDate } },
    (err, expenseArr) => {
      if (err) return next(err);

      Income.find(
        { date: { $gte: startDate, $lt: endDate } },
        (err, incomeArr) => {
          if (err) return next(err);
          //caculating saving of month
          let totalExpenseOfMonth = expenseArr.reduce((acc, cv) => {
            acc = acc + cv.amount;
            return acc;
          }, 0);
          let totalIncomeOfMonth = incomeArr.reduce((acc, cv) => {
            acc = acc + cv.amount;
            return acc;
          }, 0);
          let totalBalOfMonth = totalIncomeOfMonth - totalExpenseOfMonth;

          let newArr = incomeArr.concat(expenseArr);
          newArr = newArr.sort(function (a, b) {
            if (a.date > b.date) {
              return 1;
            }
            if (a.date < b.date) {
              return -1;
            }
            if ((a.date = b.date)) {
              return 0;
            }
          });

          res.render('statementPage', { newArr, totalBalOfMonth });
        }
      );
    }
  );
});

module.exports = router;
