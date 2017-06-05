/**
 * Created by Home Laptop on 05-Jun-17.
 */

var express = require('express');
var router = express.Router();

var Url;
var Password = process.env.Password || 'LostWorld';

router.all('/', function (req, res, next) {
    res.writeHead(200, { 'Content-Type' : 'text/plain' });
    res.end('Hello From Northwind Redirector');
});


router.post('/proxyRegister', function (req, res, next) {
    if (req.body.Password === Password) {
        Url = req.body.Url;
        res.writeHead(200, { 'Content-Type' : 'text/plain' });
        res.end('Redirecting to ' + Url);
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
        res.redirect(308, redirect);
    }
});

module.exports = router;
