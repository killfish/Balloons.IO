
 /**
 * Module dependencies.
 * Isolate dependencies on mongo to the service layer.
 */

var mongoose = require('mongoose')
   , Kata = mongoose.model('KataSchema')
   , evaluator = require('./lib/core_evaluator')

exports.getById = function(id, fun){
  return Kata.findOne({"id": id}, fun);
};

exports.getAllKatas = function(fun){
  Kata.find({}, fun)
};

exports.save = function(kata){
  var kataObj = new Kata(kata);
  console.log(kataObj);
  kataObj.save();
};

exports.evaluate = function (data, cb) {
//  data.solution
//  data.problem_id
  return false;
};