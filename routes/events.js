var express = require('express');
var router = express.Router();
var rp = require('request-promise');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var passport = require('passport');

passport.use(new GoogleStrategy({
    clientID: '32013397026-5am1ufgrvlvkeh9kril5tgavdbc537mj.apps.googleusercontent.com',
    clientSecret: '1LLed7oPae0Da47Pw1RinLBX',
    callbackURL: "https://secret-wave-94862.herokuapp.com//events/auth/google/callback"
  },
  function(token, tokenSecret, profile, done) {
    console.log('===================')
    return done(null, profile)
  }
));

/* GET home page. */
router.post('/', function(req, res) {
  res.sendStatus(200)
  console.log(req.body.userToken)
  return
});

router.get('/widget', function(req, res) {
  // return rp.get('https://www.google.com')
  //   .then(function(response) {
  //     console.log('yes')
  //     console.log(response)
  //     res.render('index', { title: 'Flock' });
  //     console.log(req.query.flockEventToken)
  //     console.log(req.query.flockEvent)
  //     return
  //   })
  res.render('index', { title: 'Flock' });
  console.log(req.query.flockEventToken)
  console.log(req.query.flockEvent)
  return
});

router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }))

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    console.log('---------')
    console.log(res)
    // Successful authentication, redirect home.
    res.redirect('https://tranquil-wave-95184.herokuapp.com/');
  }
);

router.get('/test', function(req, res) {
  res.redirect('https://tranquil-wave-95184.herokuapp.com/');
})

module.exports = router;
