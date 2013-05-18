var app = module.parent.exports.app
    , passport = require('passport')
    , client = module.parent.exports.client
    , config = require('../config')
    , kataService = require('../services/kata-api-service.js')
    , utils = require('../utils');

/**
 *
 Test
 {
  "id": "string-reverse",
  "language": "js",
  "level": "jr",
  "challengeTitle": "String Reversal",
  "challengeCopy": "Complete the function that reverses the string",
  "templateCode": "function reverseString(str) ={}",
  "testCases": [
    {
      "description": "deal with empty input",
      "test": "reverseString()",
      "expectedResult": ""
    },
    {
      "description": "deal with odd number of characters",
      "test": "reverseString('hey')",
      "expectedResult": "yeh"
    },
    {
      "description": "deal with even number of characters",
      "test": "reverseString('heyo')",
      "expectedResult": "oyeh"
    }
  ]
}
*/

app.post('/kata', function(req, res) {
  var kata = req.body;
  console.log(kata);
  kataService.save(kata);
  res.send(kata);
});