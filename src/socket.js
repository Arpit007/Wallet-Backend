/**
 * Created by Home Laptop on 06-Nov-17.
 */
const security = require('./security');
const twilio = require('twilio');
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
    
    function UpdateUser(Data) {
        "use strict";
        let VendorObject = null, CustomerObject = null;
        if (Data.vendor === "0000000000")
            VendorObject = { Message : 'Top Up of Rs ' + Data.Amount + ' successful.', Balance : Data.VendorBalance };
        else {
            VendorObject = {
                Message : 'Payment of Rs ' + Data.Amount + ' successfully received from ' + Data.Customer,
                Balance : Data.VendorBalance
            };
            CustomerObject = {
                Message : 'Payment of Rs ' + Data.Amount + ' successfully made to ' + Data.Vendor,
                Balance : Data.CustomerBalance
            };
        }
        if (Connections[ 'Con_' + Data.VendorId ])
            Connections[ 'Con_' + Data.VendorId ].socket.emit('Update', security.encryptDefaultKey(JSON.stringify(VendorObject)));
        if (Connections[ 'Con_' + Data.CustomerId ])
            Connections[ 'Con_' + Data.CustomerId ].socket.emit('Update', security.encryptDefaultKey(JSON.stringify(CustomerObject)));
    }
    
    return { UpdateUser : UpdateUser };
};