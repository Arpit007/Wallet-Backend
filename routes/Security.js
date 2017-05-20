/**
 * Created by Home Laptop on 19-May-17.
 */
var crypto = require('crypto');
var extras=require('./Constants');

var Security={
    
    encrypt : function (data, key) {
        var cipher = crypto.createCipheriv('aes-256-ecb', key,"");
        return cipher.update(data, 'utf8', 'base64') + cipher.final('base64');
    },
    
    encryptDefaultKey :function (data) {
        var key = extras.key;
        var cipher = crypto.createCipheriv('aes-256-ecb', key,"");
        return cipher.update(data, 'utf8', 'base64') + cipher.final('base64');
    },
    
    decrypt : function (data, key) {
        var decipher = crypto.createDecipheriv('aes-256-ecb', key, "");
        return decipher.update(data, 'base64', 'utf8') + decipher.final('utf8');
    },
    
    decryptDefaultKey : function (data) {
        var key = extras.key;
        var decipher = crypto.createDecipheriv('aes-256-ecb', key, "");
        return decipher.update(data, 'base64', 'utf8') + decipher.final('utf8');
    }
};

module.exports=Security;