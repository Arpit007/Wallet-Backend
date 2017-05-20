/**
 * Created by Home Laptop on 19-May-17.
 */
var mongo = require('mongodb');
var extras = require('./Constants');
var mongoClient=mongo.MongoClient;

var Mongo= {
    Apply: function (ActionFunction) {
        mongoClient.connect(extras.dbUrl, function (err, db) {
            if (err) throw err;
            ActionFunction(db,function () {
                db.close();
            });
        });
    }
};

module.exports = Mongo;