var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// https://mongoosejs.com/docs/guide.html#schemas

// Temporary Schema built with current API
module.exports = mongoose.model('Activity', new Schema({
    "name": { type: String, required: true },
    "topic": { type: [String], required: true },
    "place": { type: String, required: true },
    "date": { type: Date, required: true }, // https://mongoosejs.com/docs/schematypes.html#dates
    "creator": { type: String, required: true },
    "maxSlot": { type: Number, required: true },
    "remainingSlots": Number,
    "warnings": { type: Number, default: 0 },
    "ended": {type: Boolean, default: false}
}))