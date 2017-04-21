'use strict';

var Item = require('./item.model');
var itemByRegion = require('./itemByRegion.model');
module.exports = {
    findAllNews: function(req, res) {
        Item.find().exec(function(err, data) {
            if (err) {
                console.log('Error in get all from database', err);
                res.send(err);
            }
            res.json(data);
        });
    }
}