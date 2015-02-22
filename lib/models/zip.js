var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var zipSchema = new Schema({
  _id: {type: String},
  city: {type: String},
  loc: [],
  pop: Number,
  state: String
});

module.exports = Mongoose.model('Zip', zipSchema);