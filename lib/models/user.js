var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var userSchema = new Schema({
  name: { type: String, required: true },
  googleId: { type: Number, required: true, unique: true },
  plusLink: { type: String, required: true, unique: true },
  picture: { type: String, required: true },
  zip: {type: String, validate: /^\d{5}(\-?\d{4})?$/gm },
  email: {type: String, validate: /([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}/igm },
  emailAlertActive: {type: Boolean, default: false},
  latitude: Number,
  longitude: Number,
  emailDistance: {type: Number, default: 100},
  emailMagnitude: {type: Number, default: 6},
  lastEmailAlertSent: {type: Number, default: Date.now()},
  emailFrequency: {type: Number, default: 600000},
  cell: {type: String, validate: /1?\s*\W?\s*([2-9][0-8][0-9])\s*\W?\s*([2-9][0-9]{2})\s*\W?\s*([0-9]{4})(\se?x?t?(\d*))?/g},
  textAlertActive: {type: Boolean, default: false},
  textFrequency: {type: Number, default: 300000},
  textMagnitude: {type: Number, min: 6, max: 9, default: 7},
  lastTextAlertSent: {type: Number, default: Date.now()}
});


module.exports = Mongoose.model('User', userSchema);

