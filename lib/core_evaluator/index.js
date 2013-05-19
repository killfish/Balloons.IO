/**
 * Core evaluation service/facade
 */

var mongoose = require('mongoose')
  , KataEvaluation = mongoose.model('KataEvaluation')
  , jsEvaluator = require('../js_evaluator')
  , kataService = require('../../services/kata-service.js')
  , _ = require('underscore')

//  evaluatable.solution
//  evaluatable.problem_id

exports.evaluate = function(evaluatable, cb){
  kataService.getById(evaluatable.problemId, function(err, kata){
    if (err) console.log("Something went wrong: " + err)
    else{
      switch(kata.language){
        case 'js':
          jsEvaluator.evaluate(evaluatable, kata, cb)
      }
    }
  });
};
