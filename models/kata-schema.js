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
    {description: String, test: String, expectedResult: String}
  ],
  comments: [
    { body: String, date: Date }
  ],
  meta: {
    favs: Number
  }
});

mongoose.model('KataSchema', KataSchema)