const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    activityId: { type: mongoose.Schema.Types.ObjectId, required: true },
    reportedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);