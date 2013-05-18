var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var KataSchema = new Schema({
  id: String,
  language: String,
  level: String,
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