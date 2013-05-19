
 /**
 * Module dependencies.
 * Isolate dependencies on mongo to the service layer.
 */

var mongoose = require('mongoose')
    , Kata = mongoose.model('KataSchema')

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

exports.evaluateSubmission = function(data){
	var solution = data.solution;
	var problem_id = data.problem_id;
};
