var app = module.parent.exports.app
    , passport = require('passport')
    , client = module.parent.exports.client
    , config = require('../config')
    , utils = require('../utils');

/*
 * Rooms list
 */

app.get('/rooms', utils.restrict, function(req, res) {
    utils.getPublicRoomsInfo(client, function(rooms) {
        res.render('room_list', { rooms: rooms });
    });
});

/*
 * Create a rooom
 */

app.post('/create', utils.restrict, function(req, res) {
    utils.validRoomName(req, res, function(roomKey) {
        utils.roomExists(req, res, client, function() {
            utils.createRoom(req, res, client);
        });
    });
});

/*
 * Join a room
 */

app.get('/:id', utils.restrict, function(req, res) {
    utils.getRoomInfo(req, res, client, function(room) {
        utils.getUsersInRoom(req, res, client, room, function(users) {
            utils.getPublicRoomsInfo(client, function(rooms) {
                utils.getUserStatus(req.user, client, function(status) {
                    utils.enterRoom(req, res, room, users, rooms, status);
                });
            });
        });
    });
});