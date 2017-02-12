var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var events = require('./routes/events');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var gcal     = require('google-calendar');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});


app.use('/', index);
app.use('/users', users);
app.use('/events', events);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.use(new GoogleStrategy({
    clientID: '32013397026-5am1ufgrvlvkeh9kril5tgavdbc537mj.apps.googleusercontent.com',
    clientSecret: '1LLed7oPae0Da47Pw1RinLBX',
    callbackURL: "http://localhost:8080/events/auth/google/callback",
    scope: ['openid', 'email', 'https://www.googleapis.com/auth/calendar']
  },
  function(token, tokenSecret, profile, done) {
    console.log(token)
    return done(null, profile)
  }
));

app.get('/events/auth/google', passport.authenticate('google', { scope: ['openid', 'email', 'https://www.googleapis.com/auth/calendar'] }))

app.get('/events/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/events/widget');
  }
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
