
 /**
 * Module dependencies.
 * Isolate dependencies on mongo to the service layer.
 */

var mongoose = require('mongoose')
    , Kata = mongoose.model('KataSchema')

//exports.get = function(id){
//  return Kata.get(id)
//}
//
//exports.list = function(){
//  return Kata.list()
//}

exports.save = function(kata){
  console.log(kata)
  var kataObj = new Kata({
    id: kata.id,
    language: kata.language,
    level: kata.level,
    challengeTitle: kata.challengeTitle,
    challengeCopy: kata.challengeCopy,
    templateCode: kata.templateCode,
    testCases: kata.testCases
  })

  console.log(kataObj)

  kataObj.save()
}




/*
 var mongoose = require('mongoose')
 , Schema = mongoose.Schema;

 var KataSchema = new Schema({
 id: String,
 language: String,
 level: String,
 challengeTitle: String,
 challengeCopy: String,
 templateCode: String,
 testCases: [
 {test: String, expectedResult: String}
 ],
 comments: [
 { body: String, date: Date }
 ],
 meta: {
 favs: Number
 }
 });

 mongoose.model('KataSchema', KataSchema)
  */