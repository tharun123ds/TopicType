const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    }
}, { timestamps: true });

// Fix: prevent OverwriteModelError
module.exports = mongoose.models.Topic || mongoose.model('Topic', topicSchema);
