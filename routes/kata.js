var app = module.parent.exports.app
    , passport = require('passport')
    , client = module.parent.exports.client
    , config = require('../config')
    , kataService = require('../services/kata-service.js')
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
   "templateCode": "function reverseString(str){};",
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



 Modify the previous program such that only the users Alice and Bob are greeted with their names.

 {
   "id": "greetings-alice",
   "language": "js",
   "level": "jr",
   "challengeTitle": "Meet Alice and Bob",
   "challengeCopy": "Modify the function such that only the users Alice and Bob are greeted with their names",
   "templateCode": "function makeGreeting(name){return 'Greetings ' + name};",
   "testCases": [
     {
       "description": "return null with a name other than Alice or Bob",
       "test": "makeGreeting('John');",
       "expectedResult": ""
     },
     {
       "description": "make a greeting for Alice: Greetings Alice",
       "test": "makeGreeting('Alice');",
       "expectedResult": "Greetings Alice"
     },
     {
       "description": "make a greeting for John: Greetings John",
       "test": "makeGreeting('Bob');",
       "expectedResult": "Greetings Bob"
     }
   ]
 }

 {
   "id": "missing-cat's-eye",
   "language": "js",
   "level": "jr",
   "challengeTitle": "The missing cat's eye",
   "challengeCopy": "The function will recieve the string 'kittycatseye', but with one character omitted. Return the missing character",
   "templateCode": "function findMissingLetter(word){return 'Greetings ' + name};",
   "testCases": [
     {
       "description": "did not find the missing letter",
       "test": "findMissingLetter('kittyctseyeforus');",
       "expectedResult": "a"
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

app.get('/kata/random', function(req, res){
  kataService.getAllKatas(function(err, kata){
    if(err) res.send(err)
    console.log("kata list size is: " + kata.length)

    var randPic = getRandomInt(0, kata.length-1)
    console.log(randPic)
    res.send(kata[randPic])
  });
});

app.get('/kata/:id', function(req, res){
  console.log("get")
  console.log(req.params.id);
  kataService.getById(req.params.id, function(err, kata){
    if(err) res.send(err)
    console.log("kata is: " + kata)
    res.send(kata)
  });
});

/**
 *
 * helpers
 */

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
