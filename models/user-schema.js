var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var UserSchema = new Schema({
  id: String,
  firstname: String,
  lastname: String,
  quote: String,
  datejoined: Date,
  occupation: String,
  picture: String,
  age: Number,
  language: String,
  level: String,
  reputation: Number,
  solvedkatas: [ String ],
  friends: [ String ]
});

mongoose.model('UserSchema', UserSchema)