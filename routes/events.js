var express = require('express');
var request = require('request');
var router = express.Router();
var rp = require('request-promise');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var passport = require('passport');
var config = require('../config')

var memo = "this is a message for Andrew at 11:00";
var gcal = require('google-calendar');
var google_calendar = null
var userToken = ''
var chat = ''
var messageUid = ''
var accessToken = ''

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.use(new GoogleStrategy({
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    callbackURL: config.callbackURL,
    scope: ['openid', 'email', 'https://www.googleapis.com/auth/calendar']
  },
  function(token, tokenSecret, profile, done) {
    console.log('==========')
    console.log(token)
    google_calendar = new gcal.GoogleCalendar(token);
    return done(null, profile)
  }
));

/* GET home page. */
router.post('/', function(req, res) {
  console.log(config.clientID)
  res.sendStatus(200)
  userToken = req.body.userToken
  console.log(userToken)
  return
});

router.post('/gcl', function(req, res) {
  const spec = req.body
  const summary = spec.summary
  const start = spec.start
  const end = spec.end
  const tz = spec.timezone
  google_calendar.calendarList.list(function(err, calendarList) {
    console.log(calendarList)
    var event = {
      'summary': summary,
      'start': {
        'dateTime': start,
        'timeZone': tz
      },
      'end': {
        'dateTime': end,
        'timeZone': tz
      }
    };

    google_calendar.events.insert(calendarList.items[0].id, event, function(err, data) {
      console.log(err)
      if(err) return res.send(500,err);
      console.log(data)
      res.send(200, calendarList)
    })
  })
})

router.get('/redirect', function(req, res) {
  console.log("===============" + req.query.flockEvent);
  var data = JSON.parse(req.query.flockEvent);
  chat = data.chat;
  messageUid = data.messageUids.messageUid;
  console.log("===============user" + userToken);
  console.log("===============chat" + chat);
  console.log("===============messageUid" + messageUid);
  res.redirect('https://dev-ragingoctopus.herokuapp.com/');
})

router.get('/getData', function(req, res) {
  var params = {
    uri: 'https://api.flock.co/v1/chat.fetchMessages',
    body: {
      token: userToken,
      chat: chat,
      uids: [messageUid]
    },
    json: true
  }

  request(params,function (error, response, body){
      if (body[0].text === undefined) {
        res.send(200, {"data": ''})
      } else {
        res.send(200, {"data": body[0].text})
      }
      
      return
  }); 


})

router.get('/auth/google', passport.authenticate('google', { scope: ['openid', 'email', 'https://www.googleapis.com/auth/calendar'] }))

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('https://dev-ragingoctopus.herokuapp.com/');
  }
);

module.exports = router;
