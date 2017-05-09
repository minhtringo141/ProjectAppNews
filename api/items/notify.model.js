'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Notify = new Schema({
    key: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Notify', Notify, 'notify');