var express = require('express');
var request = require('request');
var router = express.Router();
var rp = require('request-promise');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var passport = require('passport');
var memo = "this is a message for Andrew at 11:00";

var gcal = require('google-calendar');
var google_calendar = new gcal.GoogleCalendar('ya29.GlvwA6SMEkFqyBMTvNmisEdLnfYYykdfTcr3BBGyg3KZ_jkP9zzrJWvbmr9X3HQzj9SqT8APsK9-LItJbMUjISOPjzygVQenAMEMz7hASxBP4O3Lx1SB3bLcSttR');
var userToken = ''
var chat = ''
var messageUid = ''

passport.use(new GoogleStrategy({
    clientID: '32013397026-5am1ufgrvlvkeh9kril5tgavdbc537mj.apps.googleusercontent.com',
    clientSecret: '1LLed7oPae0Da47Pw1RinLBX',
    callbackURL: "https://secret-wave-94862.herokuapp.com//events/auth/google/callback"
  },
  function(token, tokenSecret, profile, done) {
    console.log(token)
    return done(null, profile)
  }
));

/* GET home page. */
router.post('/', function(req, res) {
  res.sendStatus(200)
  userToken = req.body.userToken
  console.log(userToken)
  return
});

router.post('/gcl', function(req, res) {
  const spec = req.body
  console.log(spec)
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
var json = {
              "token": userToken,
              "chat": chat,
              "uids": ["1486890669297-7E79Ap-mh104"]
            }
router.get('/getData', function(req, res) {

  request({
      url: "https://api.flock.co/v1/chat.fetchMessages",
      method: "POST",
      json: true,   // <--Very important!!!
      body: json
  }, function (error, response, body){
      console.log(body);
  });

  let options = {  
    url: 'https://api.flock.co/v1/chat.fetchMessages',
    form: {
      "token": userToken,
      "chat": chat,
      "uids": ['1486890669297-7E79Ap-mh104']
    }
  };

  request.post(options, function (error, response, body){
      console.log("+++++++++++" + body);
  }); 

  var params = {
    uri: 'https://api.flock.co/v1/chat.fetchMessages',
    body: {
      token: userToken,
      chat: chat,
      uids: ['1486890669297-7E79Ap-mh104']
    },
    json: true
  }

  request(params,function (error, response, body){
      console.log("+++++++++++" + body);
  }); 

  res.send(200, {"data": memo})
  return
})

module.exports = router;
