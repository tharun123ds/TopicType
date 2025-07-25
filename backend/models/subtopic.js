const mongoose = require('mongoose');

const subtopicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true,
    }
}, { timestamps: true });

// Ensure unique subtopic per topic
subtopicSchema.index({ name: 1, topic: 1 }, { unique: true });

// Fix: prevent OverwriteModelError
module.exports = mongoose.models.Subtopic || mongoose.model('Subtopic', subtopicSchema);
