/**
 * Created by Home Laptop on 06-Nov-17.
 */
const express = require('express');
const model = require('../model/models');
const Payload = require('../src/payloadEditor');

const router = express.Router();

router.post('/', function (req, res) {
    const Data = Payload.Parse(req.body.Data);
    model.transaction.transact(Data, function (finalData, Code) {
        const Reply = Payload.Stringify(Data, finalData, Code);
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

router.post('/sms', function (req, res) {
    const Data = parsePayload(req.body.Data);
    model.transact.transact(Data, function (finalData, Code) {
        "use strict";
        const Reply = Payload.Stringify(Data, finalData, Code);
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