/**
 * Created by Home Laptop on 06-Nov-17.
 */
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

module.exports = (dbUrl) => {
    mongoose.connect(dbUrl, function (err) {
        "use strict";
        if (err)return console.log(err);
        console.log("MongoDB Successfully Connected");
    });
};
