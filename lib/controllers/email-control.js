var mandrill = require('mandrill-api/mandrill');
var Config = require('../../config');
mandrill_client = new mandrill.Mandrill(Config.mandrill_key);

module.exports = {
       sendMail: function(distance, magnitude){
         var message = {
        "text": "Earthquake has been detected " + distance + " miles from you with a magnitude of " + magnitude,
        "subject": "Alert from quakemon.com",
        "from_email": "alerts@quakemon.com",
        "from_name": "Quakemon Alerts",
        "to": [{
                "email": "edawebdesign@gmail.com",
                "name": "test",
                "type": "to"
            }],
        };
        var async = false;
        var ip_pool = "Main Pool";
        var send_at = "";
        mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool, "send_at": send_at}, function(result) {
            console.log(result);
            /*
            [{
                    "email": "recipient.email@example.com",
                    "status": "sent",
                    "reject_reason": "hard-bounce",
                    "_id": "abc123abc123abc123abc123abc123"
                }]
            */
        }, function(e) {
            // Mandrill returns the error as an object with name and message keys
            console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
            // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
        });
    } 
}
