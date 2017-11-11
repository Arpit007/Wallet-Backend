const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title : global.config.appName + " v1.0" });
});

module.exports = router;
