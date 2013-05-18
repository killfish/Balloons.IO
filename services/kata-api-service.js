
/**
* Module dependencies.
*/

var mongoose = require('mongoose')
    , Kata = mongoose.model('KataSchema')

exports.get = function(id){
    console.log("Hit" + id)
}