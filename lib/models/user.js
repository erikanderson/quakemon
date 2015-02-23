var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var userSchema = new Schema({
  name: { type: String, required: true },
  googleId: { type: Number, required: true, unique: true },
  plusLink: { type: String, required: true, unique: true },
  picture: { type: String, required: true },
  zip: {type: String, validate: /^\d{5}(\-?\d{4})?$/gm },
  latitude: Number,
  longitude: Number,
  warningDistanceThreshold: {type: Number, default: 100},
  warningMagnitudeThreshold: {type: Number, default: 6},
  lastEmailAlertSent: {type: Date}
});


module.exports = Mongoose.model('User', userSchema);