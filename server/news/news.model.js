'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var test = new Schema({
    sourceLink: {
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
        type: String,
        required: true
    },
    videosLinkList: [String],
    category: {
        type: String
    },
    idCategory: {
        type: Number
    },
    subTitle: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    source: {
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
    }
});

module.exports = mongoose.model('Test', test);