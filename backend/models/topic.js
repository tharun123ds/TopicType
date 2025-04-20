const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Topic', topicSchema);
