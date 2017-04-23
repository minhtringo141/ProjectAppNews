'use strict';

var Item = require('./item.model');
var itemByRegion = require('./itemByRegion.model');
module.exports = {
    findAllNews: function(req, res) {
        Item.find({ isHot: 0 }).sort('createdTime').exec(function(err, data) {
            if (err) {
                console.log('Error in get all from database', err);
                res.send(err);
            }
            res.json(data);
        });
    },
    findHotNews: function(req, res) {
        Item.find({ isHot: 1 }).sort('createdTime').exec(function(err, data) {
            if (err) {
                console.log('Error in get all from database', err);
                res.send(err);
            }
            res.json(data);
        });
    },
    findHotestNews: function(req, res) {
        Item.find({ isHot: 2 }).sort('createdTime').exec(function(err, data) {
            if (err) {
                console.log('Error in get all from database', err);
                res.send(err);
            }
            res.json(data);
        });
    }
}