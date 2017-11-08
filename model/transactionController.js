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
    const Customer = Data.ID.substr(0, 10);
    const Vendor = Data.ID.substr(10);
    const Amount = parseInt(data.Amount);
    
    if (Customer === "0000000000") {
        return transactionModel.createTransaction(Vendor, Customer, Amount)
            .then((transaction) => {
                return userModel.getUser(Vendor)
                    .then((user) => {
                        user.balance += Amount;
                        user.credit.push(transaction._id);
                        return user.save()
                            .then(() => {
                                return {
                                    Customer : Customer,
                                    Vendor : Vendor,
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
            })
    }
    else {
        return userModel.getUser(Customer)
            .then((customer) => {
                if (customer.balance < data.Amount)
                    throw status.invalid;
                return userModel.getUser(Vendor)
                    .then((vendor) => {
                        return transactionModel.createTransaction(Vendor, Customer, data.Amount)
                            .then((transaction) => {
                                vendor.balance += data.Amount;
                                customer.balance -= data.Amount;
                                vendor.credit.push(transaction._id);
                                customer.debit.push(transaction._id);
                                return customer.save()
                                    .then(vendor.save)
                                    .then(() => {
                                        return {
                                            Customer : Customer,
                                            Vendor : Vendor,
                                            CustomerBalance : customer.balance,
                                            VendorBalance : vendor.balance,
                                            TimeStamp : transaction.date
                                        };
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