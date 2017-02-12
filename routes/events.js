var express = require('express');
var router = express.Router();
var rp = require('request-promise');
var gcal = require('google-calendar');
var google_calendar = new gcal.GoogleCalendar('ya29.GlvwA6SMEkFqyBMTvNmisEdLnfYYykdfTcr3BBGyg3KZ_jkP9zzrJWvbmr9X3HQzj9SqT8APsK9-LItJbMUjISOPjzygVQenAMEMz7hASxBP4O3Lx1SB3bLcSttR');
var userToken = ''

/* GET home page. */
router.post('/', function(req, res) {
  res.sendStatus(200)
  userToken = req.body.userToken
  console.log(userToken)
  return
});

router.get('/widget', function(req, res) {
  res.render('index', { title: 'Flock' });
  console.log(req.query.flockEventToken)
  console.log(req.query.flockEvent)
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
        // 'dateTime': '2017-02-14T09:00:00-07:00',
        // 'timeZone': 'America/Los_Angeles'
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

    // google_calendar.events.quickAdd('cyrilyu.tw@gmail.com', 'Testing Again', function(err, data) {
    //   if(err) return res.send(500,err);
    //   console.log(data)
    // });
    
  })
  
})

module.exports = router;
