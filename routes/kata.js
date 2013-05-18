var app = module.parent.exports.app
    , passport = require('passport')
    , client = module.parent.exports.client
    , config = require('../config')
    , kataService = require('../services/kata-api-service.js')
    , utils = require('../utils');
//
//app.get('/kata/:id', utils.restrict, function(req, res) {
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

app.get('/kata', function(req, res) {
    kataService.get(1234)
});