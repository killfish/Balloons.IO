var app = module.parent.exports.app
    , passport = require('passport')
    , client = module.parent.exports.client
    , config = require('../config')
    , kataService = require('../services/kata-api-service.js')
    , utils = require('../utils');

app.post('/kata/new/:id', utils.restrict, function(req, res) {
  var body = request.body;


});