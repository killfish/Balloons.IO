
/*
 * Module dependencies
 */

var app = module.parent.exports.app
  , passport = require('passport')
  , client = module.parent.exports.client
  , config = require('../config')
  , utils = require('../utils');

/*
 * Homepage
 */

app.get('/', function(req, res, next) {
  if(req.isAuthenticated()){
    client.hmset(
        'users:' + req.user.provider + ":" + req.user.username
      , req.user
    );
    res.redirect('/rooms');
  } else{
    res.render('index');
  }
});

/*
 * Authentication routes
 */

if(config.auth.twitter.consumerkey.length) {
  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitter/callback', 
    passport.authenticate('twitter', {
      successRedirect: '/',
      failureRedirect: '/'
    })
  );
}

if(config.auth.facebook.clientid.length) {
  app.get('/auth/facebook', passport.authenticate('facebook'));

  app.get('/auth/facebook/callback', 
    passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/'
    })
  );
}

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});



///**
// * API for code submission
// */
//
//app.get('/:id', utils.restrict, function(req, res) {
//    utils.getRoomInfo(req, res, client, function(room) {
//        utils.getUsersInRoom(req, res, client, room, function(users) {
//            utils.getPublicRoomsInfo(client, function(rooms) {
//                utils.getUserStatus(req.user, client, function(status) {
//                    utils.enterRoom(req, res, room, users, rooms, status);
//                });
//            });
//        });
//    });
//});

