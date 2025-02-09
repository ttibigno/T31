const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required: true, unique: true }
});

module.exports = mongoose.model('Admin', adminSchema);
