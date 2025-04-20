const mongoose = require('mongoose');
const User = require('./user');

const typingResultSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String }, // Will be auto-filled based on user ref
    topic: { type: String, required: true },
    totalTests: { type: Number, default: 0 },
    totalTime: { type: Number, default: 0 }, // in seconds
    averageWPM: { type: Number, default: 0 },
    averageAccuracy: { type: Number, default: 0 },
}, { timestamps: true });

typingResultSchema.index({ user: 1, topic: 1 }, { unique: true });


module.exports = mongoose.model('TypingResult', typingResultSchema);
