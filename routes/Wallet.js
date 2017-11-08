/**
 * Created by Home Laptop on 06-Nov-17.
 */
const express = require('express');
const model = require('../model/models');
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