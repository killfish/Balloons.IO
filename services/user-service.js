
 /**
 * Module dependencies.
 * Isolate dependencies on mongo to the service layer.
 */

var mongoose = require('mongoose')
   , User = mongoose.model('UserSchema')
   , evaluator = require('../lib/core_evaluator/')

exports.getById = function(id, fun){
  return User.findOne({"id": id}, fun);
};

exports.create = function(user){
  console.log("add:" + user.id);
  User.findOne({ id : user.id }, function(err,data){
    console.log("user add err check: " + err);
    if(data==null){
      var userObj = new User(user);
      console.log(userObj);
      userObj.save();
      console.log("user added to db");
    } else {
      console.log("user already in db: " + data);
    }
  });
};

exports.save = function(user){
  var query = { id: user.id };
  User.findByIdAndUpdate(query, user, function(err, data){
    if(err){
      console.log(err);
    } else {
      console.log(data);
    }
  });
};

exports.remove = function(id){
  console.log("remove:" + id);
  var query = { id: id };
  User.findOneAndRemove(query, function(err, data){
    if(err){
      console.log("User remove error:" + err);
    } else {
      console.log("User remove completed:" + data);
    }
  });
};
