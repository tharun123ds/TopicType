
const mongoose = require('mongoose');
const User = require('./user');

const globalTypingStatsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    username: { type: String },

    totalTests: { type: Number, default: 0 },
    totalTime: { type: Number, default: 0 }, // in seconds
    averageWPM: { type: Number, default: 0 },
    averageAccuracy: { type: Number, default: 0 }
}, { timestamps: true });


module.exports = mongoose.model('GlobalTypingStats', globalTypingStatsSchema);
