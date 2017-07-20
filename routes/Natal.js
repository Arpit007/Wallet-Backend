/**
 * Created by Home Laptop on 05-Jun-17.
 */

var express = require('express');
var fs = require('fs');
var router = express.Router();
var request = require('request-promise');

var Promise = require('bluebird');
var mongoose = require('mongoose');

mongoose.Promise = Promise;

global.mDb = mongoose.connect(require('./Constants').dbUrl);

global.createPromise = function () {
    return new Promise(function (resolve, reject) {
        resolve({});
    });
};

var Url = "";

var Schema = mDb.Schema({
    _id : { type : Number, required : true },
    Url : { type : String }
});

var Data = mDb.model('Url', Schema);

Data.findById(1)
    .then(function (data) {
        if (data) {
            Url = data.Url;
        }
    });


router.all('/', function (req, res, next) {
    res.writeHead(200, { 'Content-Type' : 'text/plain' });
    res.end('Hello From Natal Redirector');
});


router.post('/proxyRegister', function (req, res, next) {
    var oldPassword = process.env.Password || 'LostWorld';
    if (req.body.Password === oldPassword) {
        Url = req.body.Url;
        Url = Url.trim();
        if (Url[ Url.length - 1 ] === '/')
            Url = Url.substr(0, Url.length - 1);
    
        Data.findById(1)
            .then(function (data) {
                if (!data) {
                    data = new Data();
                    data._id = 1;
                }
                data.Url = Url;
            
                return data.save()
                    .then(function () {
                        res.writeHead(200, { 'Content-Type' : 'text/plain' });
                        res.end('Redirecting to ' + Url);
                    });
            })
            .catch(function (e) {
                console.log(e);
                res.end(e);
            });
    }
    else {
        res.writeHead(400, { 'Content-Type' : 'text/plain' });
        res.end('Wrong Password');
    }
});

router.all('/url', function (req, res, next) {
    if (!Url) {
        res.writeHead(200, { 'Content-Type' : 'text/plain' });
        res.end('Redirecting to None');
    }
    else {
        res.writeHead(200, { 'Content-Type' : 'text/plain' });
        res.end('Redirecting to ' + Url);
    }
});

router.all('/*', function (req, res, next) {
    if (!Url) {
        res.writeHead(400, { 'Content-Type' : 'text/plain' });
        res.end('Set Url First');
    }
    else {
        var redirect = Url + req.url;
        var Options = {
            method : req.method,
            uri : redirect,
            body : req.body,
            json : true
        };
        return request(Options)
            .then(function (data) {
                if (typeof data === 'string')
                    res.end(data);
                else res.end(JSON.stringify(data));
            });
    }
});
module.exports = router;
