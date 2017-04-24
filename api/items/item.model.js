'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Item = new Schema({
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
    isHot: {
        type: Number,
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
    }]
});

module.exports = mongoose.model('Item', Item, 'item');