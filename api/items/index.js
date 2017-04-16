'use strict';

var express = require('express');
var controller = require('./item.controller');
var router = express.Router();

router.get('/all', controller.findAllNews);

module.exports = router;