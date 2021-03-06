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
    imagesLinkList: [{
        image: String,
        subTitleImage: String
    }],
    content: {
        type: [String],
        required: true
    },
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
    },
    relatedItemArray: [{
        itemLink: String,
        imagesLinkList: [{
            image: String,
            subTitleImage: String
        }],
        content: [String],
        title: String,
        subTitle: String,
        uploadedTime: String,
        sourceName: String,
        sourceIconLink: String
    }],
    isHot: Number,
    isReadlater: Number
});

module.exports = mongoose.model('itemByRegion', itemByRegion, 'itemByRegion');