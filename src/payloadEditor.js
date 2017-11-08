/**
 * Created by Home Laptop on 08-Nov-17.
 */
const security = require('./security');

function Parse(payload) {
    try {
        //payload = JSON.parse(security.decrypt(payload));
        payload = JSON.parse(payload);
        return {
            Customer : payload[ 'i' ].substr(10),
            Vendor : payload[ 'i' ].substr(0, 10),
            Amount : parseInt(payload[ 'a' ]),
            OTP : payload[ 'o' ],
            TimeStamp : payload[ 't' ]
        };
    }
    catch (e) {
        return null;
    }
}

function Stringify(Receive, Payload, status) {
    "use strict";
    const Data = {
        s : status,
        i : Payload.Vendor + Payload.Customer,
        vb : Payload.VendorBalance,
        cb : Payload.CustomerBalance,
        o : Receive.OTP
    };
    //return security.encrypt(JSON.stringify(Data));
    return (JSON.stringify(Data));
}

module.exports = {
    Parse : Parse,
    Stringify : Stringify
};

/*
 *Minimal Tags to reduce payload Size(To keep SMS Payloads Minimal)
 * i: ID
 * a: Amount
 * o: OTP
 * t: Timestamp
 * */

/*
 * Reply Payload
 * s: Status
 * i: ID Customer + Vendor
 * vb: Vendor Balance
 * cb: Customer Balance
 * */