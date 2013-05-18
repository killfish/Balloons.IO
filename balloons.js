/*
 * Module dependencies
 */

var express = require('express')
  , http = require('http')
  , passport = require('passport')
  , config = require('./config.json')
  , init = require('./init')
  , redis = require('redis')
  , fs = require('fs')
  , mongoose = require('mongoose')
  , RedisStore = require('connect-redis')(express);

/*
 * Instantiate mongo
 */
mongoose.connect('mongodb://localhost/kata');

/*
 * Instantiate redis
 */

if (process.env.REDISTOGO_URL) {
  var rtg   = require('url').parse(process.env.REDISTOGO_URL);
  var client = exports.client  = redis.createClient(rtg.port, rtg.hostname);
  client.auth(rtg.auth.split(':')[1]); // auth 1st part is username and 2nd is password separated by ":"
} else {
  var client = exports.client  = redis.createClient();
}

var sessionStore = exports.sessionStore = new RedisStore({client: client});

/*
 * Clean db and create folder
 */

init(client);

/*
 * Passportjs auth strategy
 */

require('./strategy');

/*
 * Create and config server
 */

var app = exports.app = express();

app.configure(function() {


  app.set('port', process.env.PORT || config.app.port || 6789);
  app.set('view engine', 'jade'); 
  app.set('views', __dirname + '/views/themes/' + config.theme.name);
  app.use(express.static(__dirname + '/public'));
  app.use(express.bodyParser());
  app.use(express.cookieParser(config.session.secret));
  app.use(express.session({
    key: "balloons",
    store: sessionStore
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });
  app.use(app.router);
});




// Bootstrap models
var models_path = __dirname + '/models'
fs.readdirSync(models_path).forEach(function (file) {
  require(models_path+'/'+file)
})



/*
 * Routes
 */

require('./routes/auth.js');
require('./routes/kata.js');
require('./routes/rooms.js');

/*
 * Web server
 */

exports.server = http.createServer(app).listen(app.get('port'), function() {
  console.log('CodeKata.io started on port %d', app.get('port'));
});


/*
 * Socket.io
 */

require('./sockets');


/*
 * Catch uncaught exceptions
 */

process.on('uncaughtException', function(err){
  console.log('Exception: ' + err.stack);
});



