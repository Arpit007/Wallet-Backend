/**
 * Created by Home Laptop on 19-May-17.
 */
var database = require('./Database');
var transactionResult = require('./TransactionResult');
var activeConnections = require('./ActiveConnections');

var Transact = {
    transact : function (Data, callback) {
        var Customer = Data.ID.substr(0, 10);
        var Vendor = Data.ID.substr(10, 10);
        var TimeStamp = Data.ID.substr(20);
        
        if (!(Data.Type === 'Pending')) {
            callback({ ID : Data.ID, Type : transactionResult.Invalid }, transactionResult.Invalid);
            return;
        }
        
        database.Apply(function (db, dbFunc) {
            var Collection = db.collection('Accounts');
            
            var updateUser = function (ID, Amount, Self, func) {
                var Query, Update;
                Query = { _id : ID };
                if (Self) {
                    Update = {
                        $set : { Balance : Amount },
                        $addToSet : { TopUp : { _id : TimeStamp, Amount : Data.Amount } }
                    };
                }
                else {
                    Update = {
                        $set : { Balance : Amount },
                        $addToSet : { Payments : { _id : Data.ID, Amount : Data.Amount } }
                    };
                }
                
                Collection.update(Query, Update, function (err, res) {
                    if (err) throw err;
                    console.log(res.result.nModified + " record updated");
                    func();
                });
            };
            
            var getAccount = function (ID, func) {
                Collection.findOne({ _id : ID }, { Balance : 1 }, function (err, result) {
                    if (err) throw err;
                    if (!result) {
                        var Document = { _id : ID, Balance : 0, Payments : [], TopUp : [] };
                        Collection.insertOne(Document, function (err, res) {
                            if (err) throw err;
                            console.log("1 record inserted");
                            func(Document);
                        });
                    }
                    else func(result);
                });
            };
            
            var newTransaction = function (ID, Self, func) {
                var Query;
                if (Self)
                    Query = [
                        { $project : { TopUp : 1 } },
                        { $unwind : '$TopUp' },
                        { $match : { 'TopUp._id' : ID } } ];
                else
                    Query = [
                        { $project : { Payments : 1 } },
                        { $unwind : '$Payments' },
                        { $match : { 'Payments._id' : ID } } ];
                
                Collection.aggregate(Query, function (err, res) {
                    if (err) throw err;
                    if (res.length==0)
                        func();
                    else callback({ ID : Data.ID, Type : transactionResult.Invalid }, transactionResult.Invalid);
                });
            };
            
            if (Customer === '0000000000') {
                newTransaction(TimeStamp, true, function () {
                    getAccount(Vendor, function (Account) {
                        var finalBalance = parseInt(Account.Balance) + parseInt(Data.Amount);
                        updateUser(Vendor, finalBalance, true, function () {
                            callback({
                                ID : Data.ID,
                                Amount : Data.Amount,
                                Type : transactionResult.Success
                            }, transactionResult.Success);
                            activeConnections.UpdateUser({
                                ID : Vendor,
                                Amount : Data.Amount,
                                'Customer' : Customer,
                                'Vendor' : Vendor,
                                FinalBalance : finalBalance
                            });
                            dbFunc();
                        });
                    });
                });
            }
            else {
                newTransaction(Data.ID, false, function () {
                    getAccount(Customer, function (Account) {
                        if (Account.Balance >= Data.Amount) {
                            var cstBalance = parseInt(Account.Balance) - parseInt(Data.Amount);
                            updateUser(Customer, cstBalance, false, function () {
                                getAccount(Vendor, function (Account) {
                                    var vndBalance = parseInt(Account.Balance) + parseInt(Data.Amount);
                                    updateUser(Vendor, vndBalance, false, function () {
                                        callback({
                                            ID : Data.ID,
                                            Amount : Data.Amount,
                                            Type : transactionResult.Success,
                                        }, transactionResult.Success);
                                        activeConnections.UpdateUser({
                                            ID : Vendor,
                                            Amount : Data.Amount,
                                            'Customer' : Customer,
                                            'Vendor' : Vendor,
                                            FinalBalance : vndBalance
                                        });
                                        activeConnections.UpdateUser({
                                            ID : Customer,
                                            Amount : Data.Amount,
                                            'Customer' : Customer,
                                            'Vendor' : Vendor,
                                            FinalBalance : cstBalance
                                        });
                                        dbFunc();
                                    });
                                });
                            });
                        }
                        else {
                            callback({ ID : Data.ID, Type : transactionResult.Invalid }, transactionResult.Invalid);
                            dbFunc();
                        }
                    });
                });
            }
        });
    }
};

module.exports = Transact;