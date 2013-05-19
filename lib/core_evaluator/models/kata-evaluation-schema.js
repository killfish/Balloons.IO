var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var kataEvaluation = new Schema({
  kataId: String,
  isPassed: Boolean,
  failedTestCases: [
    {testDesc: String, expectedResult: String}
  ]
});

mongoose.model('KataEvaluation', kataEvaluation)