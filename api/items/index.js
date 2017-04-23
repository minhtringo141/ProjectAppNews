'use strict';

var express = require('express');
var controller = require('./item.controller');
var router = express.Router();

router.get('/findAllNews', controller.findAllNews);
router.get('/findHotNews', controller.findHotNews);
router.get('/findHotestNews', controller.findHotestNews);
router.get('/homepage', controller.homepage);
module.exports = router;