var _ = require('underscore')

/**
 * example passed out
 * callback: [{"isPassed":true,"failedTestCase":"deal with empty input"},{"isPassed":true,"failedTestCase":"deal with odd number of characters"},{"isPassed":true,"failedTestCase":"deal with even number of characters"}]
 * @param evaluatable
 * @param kata
 * @param cb
 */

exports.evaluate = function(evaluatable, kata, cb){

  console.log("submission: " + evaluatable.solution)

  var result = _.map(kata.testCases, function(testCase){
    console.log("running: " + evaluatable.solution + testCase.test)

    try{
      var result = eval(evaluatable.solution + testCase.test)
    }catch (e){
      console.log("exception: " + e)
      return {
        "isPassed": false,
        "failedTestCase": testCase.description + " due to an exception"
      }
    }

    var succeeded = true

    if(result != testCase.expectedResult) succeeded=false
    else console.log("pass")

    return {
      "isPassed": succeeded,
      "failedTestCase": testCase.description
    }
  });

  cb(result)
};