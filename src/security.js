/**
 * Created by Home Laptop on 06-Nov-17.
 */
const crypto = require('crypto');

module.exports = {
    encrypt : function (data, key = global.config.key) {
        const cipher = crypto.createCipheriv('aes-256-ecb', key, "");
        return cipher.update(data, 'utf8', 'base64') + cipher.final('base64');
    },
    decrypt : function (data, key = global.config.key) {
        const decipher = crypto.createDecipheriv('aes-256-ecb', key, "");
        return decipher.update(data, 'base64', 'utf8') + decipher.final('utf8');
    }
};