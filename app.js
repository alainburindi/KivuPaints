const express = require('express');
import bodyParser from 'body-parser';
const expressLayout = require('express-ejs-layouts');
import flash from 'connect-flash';
import session from 'express-session';
import passport from 'passport';

const app = express();

//EJS
app.use(expressLayout);
app.set('view engine', 'ejs');

// BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Express session
app.use(
  session({
    secret: 'mysecretsession',
    resave: false,
    saveUninitialized: true
  })
);

// Passport config
require('./config/passport')(passport);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//Routes
app.use('/assets', express.static('public'));
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/products', require('./routes/products'));
app.use('/expenses', require('./routes/depenses'));

const PORT = process.env.PORT || 500;
app.get('/josue', (req, res) => {
  res.json({
    message: ' this message'
  });
});

app.get('/users/{id}', (req, res) => {
  res.json({
    message: `the id intered is ${req.params.id}`
  });
});

app.post('/users', (req, res) => {
  res.json({
    data: req.body
  });
});

app.listen(PORT, console.log(`Server started on port ${PORT}`));
