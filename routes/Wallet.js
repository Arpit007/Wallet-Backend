/**
 * Created by Home Laptop on 06-Nov-17.
 */
const express = require('express');
const model = require('../model/models');
const security = require('../src/security');
const Payload = require('../src/payloadEditor');
const Promise = require('bluebird');

const router = express.Router();

router.post('/', function (req, res) {
    const Data = Payload.Parse(req.body.Data);
    model.transaction.transact(Data)
        .then((finalData) => {
            "use strict";
            const Reply = Payload.Stringify(Data, finalData, model.status.success);
            res.end(Reply);
            UpdateUser(finalData, Reply);
        })
        .catch((e) => {
            "use strict";
            const Reply = Payload.Stringify(Data, {}, e);
            res.end(Reply);
            UpdateUser(Data, Reply);
        });
});

router.post('/history', function (req, res) {
    "use strict";
    
    const Client = security.decrypt(req.body.number);
    //const Client = (req.body.number);
    model.user.findOne({ number : Client }, { credit : { $slice : -5 }, debit : { $slice : -5 }, _id : 0 })
        .populate("credit")
        .populate("debit")
        .then((user) => {
            "use strict";
    
            const Response = {
                number : user.number,
                credit : [],
                debit : []
            };
    
            return Promise.each(user.credit, (crdX) => {
                const crd = crdX;
                return model.user.findById(crd.client)
                    .then((usr) => {
                        let trans = {
                            amount : crd.amount,
                            date : new Date(crd.date).getTime(),
                            client : usr ? usr.number : "0000000000",
                            vendor : user.number
                        };
                        Response.credit.push(trans);
                    });
            }).then(() => {
                return Promise.each(user.debit, (dbt) => {
                    return model.user.findById(dbt.vendor)
                        .then((usr) => {
                            const trans = {
                                amount : dbt.amount,
                                date : new Date(dbt.date).getTime(),
                                client : user.number,
                                vendor : usr ? usr.number : "0000000000"
                            };
                            Response.debit.push(trans);
                        });
                });
            }).then(() => {
                res.json(Response);
            });
        })
        .catch((e) => {
            res.json({});
        });
});

router.post('/sms', function (req, res) {
    const Data = parsePayload(req.body.Data);
    model.transaction.transact(Data)
        .then((finalData) => {
            "use strict";
            const Reply = Payload.Stringify(Data, finalData, model.status.success);
            UpdateUser(finalData, Reply);
        })
        .catch((e) => {
            "use strict";
            const Reply = Payload.Stringify(Data, {}, e);
            res.end(Reply);
            UpdateUser(Data, Reply);
        });
});

module.exports = router;