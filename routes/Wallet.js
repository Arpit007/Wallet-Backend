/**
 * Created by Home Laptop on 06-Nov-17.
 */
const express = require('express');
const model = require('../model/models');
const security = require('../src/security');
const Payload = require('../src/payloadEditor');

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
    model.user.findOne({ number : Client }, { credit : { $slice : -5 }, debit : { $slice : -5 }, _id : 0 })
        .populate("credit")
        .populate("debit")
        .then((user) => {
            "use strict";
            res.json(user);
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