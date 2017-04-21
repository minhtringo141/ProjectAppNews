'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemByRegion = new Schema({
    itemLink: {
        type: String,
        required: true
    },
    uploadedTime: {
        type: String,
        required: true
    },
    createdTime: { type: Date, default: Date.now },
    imagesLinkList: [String],
    content: {
        type: [String],
        required: true
    },
    videosLinkList: [String],
    category: {
        type: String
    },
    subTitle: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    sourceName: {
        type: String
    },
    sourceIconLink: {
        type: String
    },
    comments: {
        username: {
            type: String
        },
        time: {
            type: Date
        },
        content: {
            type: String
        }
    },
    region: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('itemByRegion', itemByRegion, 'itemByRegion');