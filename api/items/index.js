'use strict';

var express = require('express');
var controller = require('./item.controller');
var router = express.Router();

router.get('/findAllNews', controller.findAllNews);
router.get('/findHotNews', controller.findHotNews);
router.get('/findHotestNews', controller.findHotestNews);
router.get('/homepage', controller.homepage);
router.get('/category/:name', controller.findByCategory);
router.get('/city/:name', controller.findByRegion);
router.get('/listCategory', controller.listCategory);
router.post('/savedItem', controller.postSavedItem);
router.get('/savedItem', controller.getSavedItem);
router.put('/savedItem', controller.deleteSavedItem);
router.post('/favourite', controller.postFavourite);
router.get('/favourite', controller.getFavourite);
router.put('/favourite', controller.deleteFavourite);
router.get('/detailFavourite', controller.getListFavourite);
router.get('/weather', controller.weather);
router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.post('/notify', controller.getNotify);
router.get('/noti', controller.runNotify);
router.get('/item/:id', controller.getItem);
module.exports = router;