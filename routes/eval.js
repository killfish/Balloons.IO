var jsEval = require('../lib/js_evaluator')

var app = module.parent.exports.app
  , passport = require('passport')
  , client = module.parent.exports.client
  , config = require('../config')
  , kataService = require('../services/kata-service.js')
  , utils = require('../utils');

var testKata =  {
  "id": "string-reverse",
  "language": "js",
  "level": "jr",
  "challengeTitle": "String Reversal",
  "challengeCopy": "Complete the function that reverses the string",
  "templateCode": "function reverseString(str) ={}",
  "testCases": [
    {
      "description": "deal with empty input",
      "test": "reverseString('');",
      "expectedResult": ""
    },
    {
      "description": "deal with odd number of characters",
      "test": "reverseString('hey');",
      "expectedResult": "yeh"
    },
    {
      "description": "deal with even number of characters",
      "test": "reverseString('heyo');",
      "expectedResult": "oyeh"
    }
  ]
}

//var testEvaluation1 = {
//  "kataId": "string-reverse",
//  "isPassed": "",
//  "failedTestCases": []
//};

var testData1 = {
  problem_id: "n/a",
  solution: "function reverseString(s){return s.split('').reverse().join('')};"
}

app.get('/evaltest', function(req, res){

  jsEval.evaluate(testData1, testKata, function(x){
    console.log("callback: " + JSON.stringify(x))
  });
//
//  kataService.getAllKatas(function(err, kata){
//    if(err) res.send(err)
//    console.log("kata list size is: " + kata.length)
//
//    var randPic = getRandomInt(0, kata.length-1)
//    console.log(randPic)
//    res.send(kata[randPic])
//  });
});