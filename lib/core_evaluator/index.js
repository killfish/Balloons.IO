/**
 * Core evaluation service/facade
 */

var mongoose = require('mongoose')
  , KataEvaluation = mongoose.model('KataEvaluation')
  , jsEvaluator = require('../js_evaluator')
  , kataService = require('../../services/kata-service.js')
  , _ = require('underscore')

//  data.solution
//  data.problem_id

exports.evaluate = function(evaluatable, cb){
  kataService.getById(evaluatable.problemId, evalCallback)
  //  data.solution
  //  data.problem_id
};

function evalCallback(err, kata) {

}