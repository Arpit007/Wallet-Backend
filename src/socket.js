/**
 * Created by Home Laptop on 06-Nov-17.
 */
const model = require('../model/models');
const security = require('./security');
const twilioClient = require('twilio')(config.twilio.ssid, config.twilio.authToken);
const Connections = {};

module.exports = function (app) {
    const io = require('socket.io').listen(app);
    
    io.on('connection', function (socket) {
        socket.on('verify', function (_ID) {
            const Data = security.decrypt(_ID);
            const ID = Data.substr(0, 10);
            const Token = Data.substr(10);
            
            socket.UserID = ID;
            Connections[ 'Con_' + ID ] = { socket : socket, Token : Token };
            
            global.model.userModel.getBalance(ID)
                .then((balance) => {
                    "use strict";
                    balance = balance || 0;
                    socket.emit('Balance', security.encrypt(balance.toString()));
                });
        });
        
        socket.on('enquiry', function (_ID) {
            const ID = security.decryptDefaultKey(_ID);
            global.model.userModel.getBalance(ID)
                .then((balance) => {
                    "use strict";
                    balance = balance || 0;
                    socket.emit('Balance', security.encrypt(balance.toString()));
                });
        });
        
        socket.on('disconnect', function () {
            delete Connections[ 'Con_' + socket.UserID ];
        });
    });
    
    global.UpdateUser = (Data, Reply) => {
        "use strict";
        
        if (Connections[ 'Con_' + Data.Vendor ])
            Connections[ 'Con_' + Data.Vendor ].socket.emit('Update', Reply);
        else if (!config.debugMode) {
            twilioClient.messages.create({
                to : "+91" + Data.Vendor,
                from : config.twilio.number,
                body : Reply,
            }, function (err, message) {
                console.log(message.sid);
            });
        }
        if (Data.Customer !== "0000000000") {
            if (Connections[ 'Con_' + Data.Customer ])
                Connections[ 'Con_' + Data.Customer ].socket.emit('Update', Reply);
            else if (!config.debugMode) {
                twilioClient.messages.create({
                    to : "+91" + Data.Customer,
                    from : config.twilio.number,
                    body : Reply,
                }, function (err, message) {
                    console.log(message.sid);
                });
            }
        }
    };
};