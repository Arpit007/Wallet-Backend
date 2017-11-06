/**
 * Created by Home Laptop on 06-Nov-17.
 */
const transactionModel = require('./transaction');

transactionModel.createTransaction = (vendor, client, amount) => {
    return transactionModel
        .create({
            vendor : vendor,
            client : client,
            amount : amount
        })
        .catch((e) => {
            "use strict";
            console.log(e);
            return null;
        });
};

transactionModel.getTransaction = (id) => {
    transactionModel
        .findById(id)
        .catch((e) => {
            "use strict";
            console.log(e);
            return null;
        });
};

module.exports = transactionModel;