
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
  var kataObj = new Kata(kata)
  console.log(kataObj)
  kataObj.save()
}
