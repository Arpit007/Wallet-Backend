/**
 * Created by Home Laptop on 21-Jun-17.
 */
var admin = require("firebase-admin");

var serviceAccount = require('./Auth.json');

admin.initializeApp({
    credential : admin.credential.cert(serviceAccount)
});

//callback style

module.exports = {
    Sendmessage : function (Token, Type, Encrypted) {
        
        if (!Token || Token.length === 0)
            return;
        
        var payload = {
            data : {
                Type : Type,
                Data : Encrypted
            }
        };
        
        var options = {
            priority : "high"
        };
        
        admin.messaging().sendToDevice(Token, payload, options)
            .then(function (response) {
                console.log("Successfully sent message:");
            })
            .catch(function (error) {
                console.log("Error sending message:", error);
            });
    }
};
