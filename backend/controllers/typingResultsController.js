const TypingResult = require('../models/typingResult');
const GlobalTypingStats = require('../models/globalTypingStats');

const updateTypingResult = async (req, res) => {
    const userId = req.user.id;
    const { topic, wpm, accuracy, timeTaken } = req.body;

    try {
        // Update per-topic stats
        let topicResult = await TypingResult.findOne({ user: userId, topic });

        if (!topicResult) {
            topicResult = new TypingResult({
                user: userId,
                topic,
                totalTests: 1,
                totalTime: timeTaken,
                averageWPM: wpm,
                averageAccuracy: accuracy
            });
        } else {
            topicResult.totalTests += 1;
            topicResult.totalTime += timeTaken;
            topicResult.averageWPM = ((topicResult.averageWPM * (topicResult.totalTests - 1)) + wpm) / topicResult.totalTests;
            topicResult.averageAccuracy = ((topicResult.averageAccuracy * (topicResult.totalTests - 1)) + accuracy) / topicResult.totalTests;
        }

        await topicResult.save();

        // Update global stats
        let globalStats = await GlobalTypingStats.findOne({ user: userId });

        if (!globalStats) {
            globalStats = new GlobalTypingStats({
                user: userId,
                totalTests: 1,
                totalTime: timeTaken,
                averageWPM: wpm,
                averageAccuracy: accuracy
            });
        } else {
            globalStats.totalTests += 1;
            globalStats.totalTime += timeTaken;
            globalStats.averageWPM = ((globalStats.averageWPM * (globalStats.totalTests - 1)) + wpm) / globalStats.totalTests;
            globalStats.averageAccuracy = ((globalStats.averageAccuracy * (globalStats.totalTests - 1)) + accuracy) / globalStats.totalTests;
        }

        await globalStats.save();

        res.status(200).json({
            message: '✅ Typing result & global stats updated successfully.',
            topicResult,
            globalStats
        });

    } catch (error) {
        console.error('❌ Error updating typing result:', error);
        console.error('💥 Error details:', {
            userId,
            topic,
            wpm,
            accuracy,
            timeTaken
        });
        res.status(500).json({ message: 'Server error', error: error.message });
    }

};

const getTopicResults = async (req, res) => {
    try {
        const userId = req.user._id;
        const topic = req.params.topic;

        const result = await TypingResult.findOne({ user: req.user.id, topic });
        if (!result) {
            return res.status(404).json({ message: `No results found for topic "${topic}"` });
        }

        return res.status(200).json({
            message: `✅ Results for topic "${topic}"`,
            result
        });
    } catch (error) {
        console.error('❌ Error fetching topic results:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getMyGlobalStats = async (req, res) => {
    try {
        const stats = await GlobalTypingStats.findOne({ user: req.user.id });
        res.status(200).json(stats);
    } catch (error) {
        console.error('❌ Error fetching global stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    updateTypingResult,
    getTopicResults,
    getMyGlobalStats
};
