const mongoose = require('mongoose');

const participationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    activityId: { type: mongoose.Schema.Types.ObjectId, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Participation', participationSchema);