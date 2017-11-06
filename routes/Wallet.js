/**
 * Created by Home Laptop on 06-Nov-17.
 */
const express = require('express');
const transact = require('./Transact');
const twilio = require('twilio');
const status = require('../src/status');
const security = require('../src/security');

const router = express.Router();

router.post('/', function (req, res) {
    const Decrypt = security.decryptDefaultKey(req.body.Data);
    const Data = JSON.parse(Decrypt);
    /*transact.transact(Data, function (finalData, Code) {
        if (Data.OTP)
            finalData.OTP=Data.OTP;
     const Encrypt = security.encryptDefaultKey(JSON.stringify(finalData));
        res.end(Encrypt);
     });*/
});

router.post('/sms',function (req, res) {
    const Decrypt = security.decrypt(req.body.Body);
    const Data = JSON.parse(Decrypt);
    /*transact.transact(Data, function (finalData, Code) {
     let Msg;
     const Customer = finalData.ID.substr(0,10);
     const Vendor = finalData.ID.substr(10,10);
        
        if (finalData.Type===transactionResult.Success)
            Msg = "Payment of " + finalData.Amount + " from " + Customer + " to " + Vendor + " successful. The OTP is " + Data.OTP;
        else
            Msg = "Payment of " + finalData.Amount + " from " + Customer + " to " + Vendor + " failed.";
     
     const twiml = new twilio.TwimlResponse();
        twiml.message(Msg);
        res.writeHead(200, {'Content-Type': 'text/plain'});
     const t=twiml.toString();
        res.end(twiml.toString());
     });*/
});

module.exports = router;