const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique:true }
});

module.exports = mongoose.model('Admin', adminSchema);
