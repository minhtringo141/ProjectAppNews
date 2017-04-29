'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Favourite = new Schema({
    category: String
});

module.exports = mongoose.model('Favourite', Favourite, 'favourite');