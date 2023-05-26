var express = require('express');
var router = express.Router();
var homeCtrl = require('../controller/home.controller');

router.get('/', homeCtrl.index);

module.exports = router;
