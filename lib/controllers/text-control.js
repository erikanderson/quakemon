var Config = require('../../config');
// Twilio Credentials 
var accountSid = Config.twilio_sid; 
var authToken = Config.twilio_auth_token; 
 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 
 
module.exports = {
  sendText: function(userNumber, distance, magnitude){
    client.messages.create({  
      to: userNumber,
      from: "+17323911035",
      body: "Quakemon Alert: an earthquake has been detected " + distance + " miles from you with a magnitude of " + magnitude    
    }, function(err, message) { 
      console.log(message.sid); 
    });
  }
}
