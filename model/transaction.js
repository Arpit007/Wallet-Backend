/**
 * Created by Home Laptop on 06-Nov-17.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    date : { type : Date, default : Date.now },
    vendor : { type : Schema.Types.ObjectId, ref : 'User', index : true },
    client : { type : Schema.Types.ObjectId, ref : 'User', index : true },
    amount : { type : String, required : true }
});

module.exports = mongoose.model('Transaction', TransactionSchema);