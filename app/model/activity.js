var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// https://mongoosejs.com/docs/guide.html#schemas

// Temporary Schema built with current API
module.exports = mongoose.model('Activities', new Schema({
    "id": String,
    "name": String,
    "topic": [String],
    "place": String,
    "date": Date, // https://mongoosejs.com/docs/schematypes.html#dates
    "creator": Object,
    "maxSlot": Number,
    "remainingSlots": Number,
    "contacts": []
}))