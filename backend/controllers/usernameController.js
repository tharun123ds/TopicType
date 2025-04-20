const mongoose = require('mongoose');
const User = require('../models/user');
const { updateUsernameEverywhere } = require('../utils/updateUsername');

exports.changeUsername = async (req, res) => {
    const { newUsername } = req.body;

    if (!newUsername || newUsername.trim().length < 3) {
        return res.status(400).json({ message: 'Username must be at least 3 characters long' });
    }

    const exists = await User.findOne({ username: newUsername });
    if (exists) {
        return res.status(400).json({ message: 'Username is already taken' });
    }

    const userId = req.user.id;
    let user = null;

    try {
        if (mongoose.isValidObjectId(userId)) {
            user = await User.findById(userId);
        } else if (req.user.email) {
            user = await User.findOne({ email: req.user.email });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const oldUsername = user.username;
        user.username = newUsername;
        await user.save();

        await updateUsernameEverywhere(user._id, newUsername);

        return res.status(200).json({
            message: 'Username updated successfully',
            oldUsername,
            newUsername
        });

    } catch (err) {
        console.error('Username update error:', err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
