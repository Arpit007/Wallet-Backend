/**
 * Created by Home Laptop on 05-Jun-17.
 */

var express = require('express');
var fs = require('fs');
var router = express.Router();
var request = require('request-promise');

var Path = './routes/Data.txt';

var Url = fs.readFileSync(Path);

router.all('/', function (req, res, next) {
    res.writeHead(200, { 'Content-Type' : 'text/plain' });
    res.end('Hello From Natal Redirector');
});


router.post('/proxyRegister', function (req, res, next) {
    var oldPassword = process.env.Password || 'LostWorld';
    if (req.body.Password === oldPassword) {
        Url = req.body.Url;
        fs.truncate(Path, 0, function () {
            Url = Url.trim();
            if (Url[ Url.length - 1 ] === '/')
                Url = Url.substr(0, Url.length - 1);
        
            fs.writeFile(Path, Url, function (err) {
                if (err) {
                    return console.log("Error writing file: " + err);
                }
                res.writeHead(200, { 'Content-Type' : 'text/plain' });
                res.end('Redirecting to ' + Url);
            });
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
