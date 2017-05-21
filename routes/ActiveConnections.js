/**
 * Created by Home Laptop on 19-May-17.
 */
var security = require('./Security');
var database = require('./Database');
var socketIo = require('socket.io');
var io;
var Connections = {};


var ActiveConnections= {
    Init : function (app) {
        io = socketIo(app);
        io.on('connection', function (socket) {
            socket.on('ID', function (_ID) {
                var ID = security.decryptDefaultKey(_ID);
                Connections[ 'Con_' + ID ] = socket;
                socket.UserID = ID;
                userBalance(ID,function (Amount) {
                   socket.emit('Amount',security.encryptDefaultKey(Amount.toString()));
                });
            });
            socket.on('get',function (_ID) {
                var ID = security.decryptDefaultKey(_ID);
                userBalance(ID,function (Amount) {
                    socket.emit('Amount',security.encryptDefaultKey(Amount.toString()));
                });
            });
            socket.on('disconnect', function () {
                delete Connections[ 'Con_' + socket.UserID ];
            });
        });
    },
    
    UpdateUser : function (Data) {
        if (Connections[ 'Con_' + Data.ID]){
            var Object;
            if (Data.Customer === '0000000000')
                Object = {Message : 'Top Up of Rs ' + Data.Amount + ' successful.', Balance: Data.FinalBalance};
            else
                Object = {Message : 'Payment of Rs ' + Data.Amount + ' from ' + Data.Customer + ' to ' + Data.Vendor + ' successful.', Balance: Data.FinalBalance};
            var socket=Connections[ 'Con_' + Data.ID];
            socket.emit('Update',security.encryptDefaultKey(JSON.stringify(Object)));
        }
    }
};

var userBalance = function (ID, callback) {
    database.Apply(function (db, dbFunc) {
        var Collection = db.collection('Accounts');
        Collection.findOne({ _id : ID }, { Balance : 1 }, function (err, result) {
            if (err) throw err;
            if (!result) {
                var Document = { _id : ID, Balance : 0, Paid : [], Received : [], TopUp : [] };
                Collection.insertOne(Document, function (err, res) {
                    if (err) throw err;
                    console.log("1 record inserted");
                    callback(Document.Balance);
                    dbFunc();
                });
            }
            else {
                callback(result.Balance);
                dbFunc();
            }
        });
    });
};

module.exports=ActiveConnections;

