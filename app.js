const path = require('path');
const helmet = require('helmet');
const logger = require('morgan');
const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const index = require('./routes/index');
const Natal = require('./routes/Natal');
const wallet = require('./routes/Wallet');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(compression());
app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/transact',wallet);
app.use('/natal', Natal);

app.use(function(req, res, next) {
    const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
    res.locals.message = req.originalUrl + '\n\n' + err.message;
    res.locals.error = config.debugMode ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
