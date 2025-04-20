const mongoose = require('mongoose');

const subtopicSchema = new mongoose.Schema(
    {
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
    },
    {
        timestamps: true,
    }
);

// Create a compound index for name and topic to ensure uniqueness of subtopic names within the same topic
subtopicSchema.index({ name: 1, topic: 1 }, { unique: true });


module.exports = mongoose.model('Subtopic', subtopicSchema);
