var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var userSchema = new Schema({
  name: { type: String},
  googleId: { type: String, required: true, unique: true },
  plusLink: { type: String},
  picture: { type: String},
  zip: {type: String, validate: /^\d{5}(\-?\d{4})?$/gm },
  latitude: Number,
  longitude: Number,
  monitorDistance: {type: Number, default: 400},
  monitorMagnitude: {type: Number, default: 3},
  email: {type: String, validate: /([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}/igm },
  emailDistance: {type: Number, default: 100},
  emailMagnitude: {type: Number, default: 4},
  emailFrequency: {type: Number, default: 600000},
  emailAlertActive: {type: Boolean, default: false},
  lastEmailAlertSent: {type: Number, default: Date.now()},
  cell: {type: String, validate: /1?\s*\W?\s*([2-9][0-8][0-9])\s*\W?\s*([2-9][0-9]{2})\s*\W?\s*([0-9]{4})(\se?x?t?(\d*))?/g},
  textDistance: {type: Number, default: 50},
  textFrequency: {type: Number, default: 300000},
  textMagnitude: {type: Number, min: 6, max: 9, default: 7},
  textAlertActive: {type: Boolean, default: false},
  lastTextAlertSent: {type: Number, default: Date.now()}
});


module.exports = Mongoose.model('User', userSchema);

