/**
 * Created by Home Laptop on 06-Nov-17.
 */
const transactionModel = require('./transaction');
const userModel = require('./userController');
const status = require('./status');

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
    return transactionModel
        .findById(id)
        .catch((e) => {
            "use strict";
            console.log(e);
            return null;
        });
};

transactionModel.transact = (data) => {
    "use strict";
    if (data.Customer === "0000000000") {
        return userModel.getUser(data.Vendor)
            .then((user) => {
                return transactionModel.createTransaction(user._id, null, data.Amount)
                    .then((transaction) => {
                        user.balance += data.Amount;
                        user.credit.push(transaction._id);
                        return user.save()
                            .then(() => {
                                return {
                                    Customer : data.Customer,
                                    Vendor : data.Vendor,
                                    CustomerBalance : 0,
                                    VendorBalance : user.balance,
                                    TimeStamp : transaction.date
                                };
                            });
                    });
            })
            .catch((e) => {
                console.log(e);
                throw status.failed;
            });
    }
    else {
        return userModel.getUser(data.Customer)
            .then((customer) => {
                if (customer.balance < data.Amount)
                    throw status.invalid;
                return userModel.getUser(data.Vendor)
                    .then((vendor) => {
                        return transactionModel.createTransaction(vendor._id, customer._id, data.Amount)
                            .then((transaction) => {
                                vendor.balance += data.Amount;
                                customer.balance -= data.Amount;
                                vendor.credit.push(transaction._id);
                                customer.debit.push(transaction._id);
                                return customer.save()
                                    .then(() => {
                                        return vendor.save()
                                            .then(() => {
                                                return {
                                                    Customer : data.Customer,
                                                    Vendor : data.Vendor,
                                                    CustomerBalance : customer.balance,
                                                    VendorBalance : vendor.balance,
                                                    TimeStamp : transaction.date
                                                };
                                            });
                                    });
                            });
                    })
                    .catch((e) => {
                        console.log(e);
                        throw status.failed;
                    })
            })
    }
};

module.exports = transactionModel;