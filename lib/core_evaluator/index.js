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
  console.log("trying to get : " + evaluatable.problem_id)
  kataService.getById(evaluatable.problem_id, function(err, kata){
    if (err) console.log("Something went wrong: " + err)
    else{
      console.log("trying to evaluate: " + JSON.stringify(kata))
      switch(kata.language){
        case 'js':
          jsEvaluator.evaluate(evaluatable, kata, cb)
      }
    }
  });
};
