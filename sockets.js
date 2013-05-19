/*
 * Module dependencies
 */

var parent = module.parent.exports 
  , app = parent.app
  , server = parent.server
  , express = require('express')
  , client = parent.client
  , sessionStore = parent.sessionStore
  , sio = require('socket.io')
  , parseCookies = require('connect').utils.parseSignedCookies
  , cookie = require('cookie')
  , Config = require('./config')
  , config = new Config()
  , kataService = require('./services/kata-service.js')
  , fs = require('fs')
  , _ = require('underscore');


var io = sio.listen(server);
io.set('authorization', function (hsData, accept) {
  if(hsData.headers.cookie) {
    var cookies = parseCookies(cookie.parse(hsData.headers.cookie), config.session.secret)
      , sid = cookies['balloons'];

    sessionStore.load(sid, function(err, session) {
      if(err || !session) {
        return accept('Error retrieving session!', false);
      }

      hsData.balloons = {
        user: session.passport.user,
        room: /\/(?:([^\/]+?))\/?$/g.exec(hsData.headers.referer)[1]
      };

      return accept(null, true);
      
    });
  } else {
    return accept('No cookie transmitted.', false);
  }
});

io.configure(function() {
  io.set('store', new sio.RedisStore({client: client}));
  io.enable('browser client minification');
  io.enable('browser client gzip');
});


io.sockets.on('connection', function (socket) {
  var hs = socket.handshake
    , nickname = hs.balloons.user.username
    , provider = hs.balloons.user.provider
    , userKey = provider + ":" + nickname
    , room_id = hs.balloons.room
    , now = new Date()
    // Chat Log handler
    , chatlogFileName = './chats/' + room_id + (now.getFullYear()) + (now.getMonth() + 1) + (now.getDate()) + ".txt"
    , chatlogWriteStream = fs.createWriteStream(chatlogFileName, {'flags': 'a'});

  socket.join(room_id);

  client.sadd('sockets:for:' + userKey + ':at:' + room_id, socket.id, function(err, socketAdded) {
    if(socketAdded) {
      client.sadd('socketio:sockets', socket.id);
      client.sadd('rooms:' + room_id + ':online', userKey, function(err, userAdded) {
        if(userAdded) {
          client.hincrby('rooms:' + room_id + ':info', 'online', 1);
          client.get('users:' + userKey + ':status', function(err, status) {
            io.sockets.in(room_id).emit('new user', {
              nickname: nickname,
              provider: provider,
              status: status || 'available'
            });
          });
        }
      });
    }
  });

  socket.on('my msg', function(data) {
    var no_empty = data.msg.replace("\n","");
    if(no_empty.length > 0) {
      var chatlogRegistry = {
        type: 'message',
        from: userKey,
        atTime: new Date(),
        withData: data.msg
      }

      chatlogWriteStream.write(JSON.stringify(chatlogRegistry) + "\n");
      
      io.sockets.in(room_id).emit('new msg', {
        nickname: nickname,
        provider: provider,
        msg: data.msg
      });        
    }   
  });

  socket.on('set status', function(data) {
    var status = data.status;

    console.log('##### status');

    client.set('users:' + userKey + ':status', status, function(err, statusSet) {
      io.sockets.emit('user-info update', {
        username: nickname,
        provider: provider,
        status: status
      });
    });
  });


  /**
   * Original random method
   */
  socket.on('problem request', function() {
    console.log("problem1 requested")
    kataService.getAllKatas(function(err, kata){
      if(err) res.send(err)
      console.log("kata list size is: " + kata.length)

      var randPic = getRandomInt(0, kata.length-1)
      console.log(randPic)

      socket.emit('problem response', {
        response: kata[randPic]
      });
    });
  });

  /**
   * Hardcoded methods for demo
   */

  socket.on('problem request1', function() {
    console.log("problem1 requested- reverse string")
    kataService.getById("string-reverse", function(err, kata){
      if(err) console.log("error")
      socket.emit('problem response', {
        response: kata
      });
    });
  });

  socket.on('problem request2', function() {
    console.log("problem2 requested - printbob")

    kataService.getById("greetings-alice", function(err, kata){
      if(err) console.log("error")
      socket.emit('problem response', {
        response: kata
      });
    });
  });

  socket.on('problem request3', function() {
    console.log("problem3 requested")

    kataService.getById("missing-cats-eye", function(err, kata){
      if(err) console.log("error")
      socket.emit('problem response', {
        response: kata
      });
    });
  });
  
  function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  socket.on('submit request', function(data) {
    console.log("received request for submission: " + JSON.stringify(data))
    kataService.evaluate(data, function(kataEvaluation) {
      console.log("Kata evaluation: " + JSON.stringify(kataEvaluation))
      var failure = _.find(kataEvaluation, function(eval){
        return eval.isPassed == false
      })



      if(failure){
        kataEvaluation.success = false
        console.log("failure found")
      }else{
        kataEvaluation.success = true
        console.log("no failure found - emitting an erotic massage")
        io.sockets.emit('question answered', true)
      }

      socket.emit('submit response', {
        response: kataEvaluation
      });
    });
  });
//
//  socket.on('submit request1', function(data) {
//    console.log("received request1")
//    kataService.evaluate(data, function(kataEvaluation) {
//      socket.emit('submit response', {
//        response: kataEvaluation
//      });
//    });
//  });
//
//  socket.on('submit request2', function(data) {
//    console.log("received request2")
//    kataService.evaluate(data, function(kataEvaluation) {
//      socket.emit('submit response', {
//        response: kataEvaluation
//      });
//    });
//  });
//
//  socket.on('submit request3', function(data) {
//    console.log("received request3")
//    kataService.evaluate(data, function(kataEvaluation) {
//      socket.emit('submit response', {
//        response: kataEvaluation
//      });
//    });
//  });

  socket.on('history request', function() {
    var history = [];
    var tail = require('child_process').spawn('tail', ['-n', 5, chatlogFileName]);
    tail.stdout.on('data', function (data) {
      var lines = data.toString('utf-8').split("\n");
      
      lines.forEach(function(line, index) {
        if(line.length) {
          var historyLine = JSON.parse(line);
          history.push(historyLine);
        }
      });

      socket.emit('history response', {
        history: history
      });
    });
  });

  socket.on('disconnect', function() {
    // 'sockets:at:' + room_id + ':for:' + userKey
    client.srem('sockets:for:' + userKey + ':at:' + room_id, socket.id, function(err, removed) {
      if(removed) {
        client.srem('socketio:sockets', socket.id);
        client.scard('sockets:for:' + userKey + ':at:' + room_id, function(err, members_no) {
          if(!members_no) {
            client.srem('rooms:' + room_id + ':online', userKey, function(err, removed) {
              if (removed) {
                client.hincrby('rooms:' + room_id + ':info', 'online', -1);
                chatlogWriteStream.destroySoon();
                io.sockets.in(room_id).emit('user leave', {
                  nickname: nickname,
                  provider: provider
                });
              }
            });
          }
        });
      }
    });
  });
});
