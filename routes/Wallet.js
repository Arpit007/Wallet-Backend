/**
 * Created by Home Laptop on 19-May-17.
 */
var express = require('express');
var security = require('./Security');
var transact = require('./Transact');
var twilio = require('twilio');
var transactionResult = require('./TransactionResult');

var router = express.Router();

router.post('/', function (req, res) {
    var Decrypt = security.decryptDefaultKey(req.body.Data);
    var Data = JSON.parse(Decrypt);
    transact.transact(Data, function (finalData, Code) {
        if (Data.OTP)
            finalData.OTP=Data.OTP;
        var Encrypt = security.encryptDefaultKey(JSON.stringify(finalData));
        res.end(Encrypt);
    });
});

router.post('/sms',function (req, res) {
    var Decrypt = security.decryptDefaultKey(req.body.Body);
    var Data = JSON.parse(Decrypt);
    transact.transact(Data, function (finalData, Code) {
        var Msg;
        
        var Customer = finalData.ID.substr(0,10);
        var Vendor = finalData.ID.substr(10,10);
        
        if (finalData.Type===transactionResult.Success)
            Msg = "Payment of " + finalData.Amount + " from " + Customer + " to " + Vendor + " successful. The OTP is " + Data.OTP;
        else
            Msg = "Payment of " + finalData.Amount + " from " + Customer + " to " + Vendor + " failed.";
    
        var twiml = new twilio.TwimlResponse();
        twiml.message(Msg);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        var t=twiml.toString();
        res.end(twiml.toString());
    });
});

module.exports = router;