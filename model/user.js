/**
 * Created by Home Laptop on 06-Nov-17.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    number : String,
    balance : { type : Number, default : 0 },
    debit : [ { type : Schema.Types.ObjectId, ref : "Transaction" } ],
    credit : [ { type : Schema.Types.ObjectId, ref : "Transaction" } ]
});

module.exports = mongoose.model('User', UserSchema);