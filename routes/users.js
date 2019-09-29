const express = require('express');
import bcrypt from 'bcrypt';
import passport from 'passport';
import { ensureAuthenticated } from '../config/auth';

let connection = require('../config/connection');
const router = express.Router();

//Login page
router.get('/login', (req, res) => {
  res.render('login');
});

//Register page
router.get('/register', ensureAuthenticated, (req, res) => {
  res.render('register', { user: req.user });
});

router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'please fill in all fields' });
  }
  // check password match
  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  // check if password lenght is grater than six
  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least six characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2,
      user: req.user
    });
  } else {
    //check if email is already in use
    const fetchAUser = 'SELECT * FROM Users WHERE email = ?';
    connection.query(fetchAUser, [email], (err, result, fields) => {
      if (err) {
        throw err;
      }
      if (result == 0) {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            throw err;
          } else {
            const saveAUser =
              'INSERT INTO Users (name, email, password) VALUES (?, ?, ?)';
            const values = [name, email, hash];
            connection.query(saveAUser, values, (err, result) => {
              if (err) {
                throw err;
              }
              console.log(result);

              req.flash(
                'success_msg',
                'User added correctly and can login with'
              );
              res.redirect('/dashboard');
            });
          }
        });
      } else {
        errors.push({ msg: 'user with the same email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      }
    });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout handle
router.get('/logout', (req, res, next) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});
router.get('/change', ensureAuthenticated, (req, res) => {
  res.render('changePassword', { user: req.user });
});

router.post('/change', ensureAuthenticated, (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'please fill in all fields' });
  }
  // check password match
  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  // check if password lenght is grater than six
  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least six characters' });
  }

  if (errors.length > 0) {
    res.render('changePassword', {
      user: req.user,
      errors,
      password,
      password2
    });
  } else {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        throw err;
      } else {
        const saveUser = 'UPDATE Users SET password = ? WHERE id = ?';
        const values = [hash, req.user.id];
        connection.query(saveUser, values, (err, result) => {
          if (err) {
            throw err;
          }
          req.flash('success_msg', 'Password updated correctly');
          res.redirect('/dashboard');
        });
      }
    });
  }
});

module.exports = router;
