
const TypingResult = require('../models/typingResult');
const GlobalTypingStats = require('../models/globalTypingStats');

module.exports = async function updateUsernameEverywhere(userId, newUsername) {
    await Promise.all([
        TypingResult.updateMany({ user: userId }, { $set: { username: newUsername } }),
        GlobalTypingStats.updateOne({ user: userId }, { $set: { username: newUsername } }),

    ]);
};
