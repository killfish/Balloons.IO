var app = module.parent.exports.app
    , passport = require('passport')
    , client = module.parent.exports.client
    , config = require('../config')
    , userService = require('../services/user-service.js')
    , utils = require('../utils');


/**
 *
 Test

 {
   "id": "bhavin.prajapati1",
   "firstname": "Bhavin",
   "lastname": "Prajapati",
   "quote": "I am haz0r",
   "datejoined": "Sun May 19 2009 07:23:33 GMT-0800",
   "occupation": "Software Engineer - Connected Devices",
   "picture": "facebook-image-url",
   "age": 26,
   "language": "English",
   "level": "jr",
   "reputation": 100,
   "solvedkatas": ["123123","456456","678678"],
   "friends" : ["jason.goodwin", "craig.mackenzie"]
 }
 *
 **/

app.post('/user', function(req, res) {
  var user = req.body;
  userService.create(user);
  res.send(user);
});

app.get('/user/:id', function(req, res){
  console.log("get")
  console.log(req.params.id);
  userService.getById(req.params.id, function(err, user){
    if(err) res.send(err)
    console.log("user is: " + user)
    res.send(user)
  });
});

app.post('/user/remove/:id', function(req, res){
  var user = req.body;
  userService.remove(req.params.id);
  res.send(user);
});

