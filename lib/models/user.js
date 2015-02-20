var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var userSchema = new Schema({
  name: { type: String, required: true },
  googleId: { type: Number, required: true, unique: true },
  plusLink: { type: String, required: true, unique: true },
  picture: { type: String, required: true },
});


module.exports = Mongoose.model('User', userSchema);