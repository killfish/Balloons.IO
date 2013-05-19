var _ = require('underscore')

exports.evaluate = function(evaluatable, kata, cb){

  console.log("submission: " + evaluatable.solution)
  cb("yo", "ma");
  var result = _.map(kata.testCases, function(testCase){
    console.log("running: " + evaluatable.solution + testCase.test)
    var result = eval(evaluatable.solution + testCase.test)

    var succeeded = true
    if(result != testCase.expectedResult) succeeded=false
    else console.log("pass")

    return {
      "isPassed": succeeded,
      "failedTestCase": testCase.description
    }
  });

  cb(JSON.stringify(result), " ")
};