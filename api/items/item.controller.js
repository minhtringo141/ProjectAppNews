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
            "status": 1,
            "msg": "xxxx",
            "data": {
                "pro_id": "pro029292",
                "start_time": 14556585,
                "end_time": 1450444784,
                "contraction_time": 14123232,
                "break_time": 1434234243,
                "response": []
            }
        };
        Item.find({ isHot: 0 }).sort('createdTime').limit(5).exec(function(err, data) {
            if (err) {
                console.log('Error in get all from database', err);
                res.send(err);
            }
            dataHomepage.data.response[0] = data;
        });
        Item.find({ isHot: 1 }).sort('createdTime').limit(5).exec(function(err, data) {
            if (err) {
                console.log('Error in get all from database', err);
                res.send(err);
            }
            dataHomepage.data.response[1] = data;
        });
        Item.find({ isHot: 2 }).sort('createdTime').limit(5).exec(function(err, data) {
            if (err) {
                console.log('Error in get all from database', err);
                res.send(err);
            }
            dataHomepage.data.response[2] = data;
        });
        setTimeout(() => {
            res.json(dataHomepage);
        }, 2000);
    }
}