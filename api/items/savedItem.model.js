'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOneOrCreate = require('mongoose-find-one-or-create');
var SavedItem = new Schema({
    itemId: String,
    item: Object
});
SavedItem.plugin(findOneOrCreate);
module.exports = mongoose.model('SavedItem', SavedItem, 'savedItem');