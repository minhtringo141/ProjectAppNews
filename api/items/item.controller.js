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
    },
    homepage: function(req, res) {
        var dataHomepage = {
            status: 1,
            msg: "xxxx",
            data: {
                tinhot: [],
                tinnoibat: [],
                tindiaphuong: []
            }
        };
        Item.find({ isHot: 1 }).sort('createdTime').limit(5).exec(function(err, data) {
            if (err) {
                console.log('Error in get all from database', err);
                res.send(err);
            }
            dataHomepage.data.tinhot = data;
        });
        Item.find({ isHot: 2 }).sort('createdTime').limit(5).exec(function(err, data) {
            if (err) {
                console.log('Error in get all from database', err);
                res.send(err);
            }
            dataHomepage.data.tinnoibat = data;
        });
        itemByRegion.find({ isHot: 2 }).sort('createdTime').limit(5).exec(function(err, data) {
            if (err) {
                console.log('Error in get all from database', err);
                res.send(err);
            }
            dataHomepage.data.tindiaphuong = data;
        });
        setTimeout(() => {
            res.json(dataHomepage);
        }, 2000);
    }
}