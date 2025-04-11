const crypto = require('crypto');
const User = require('../models/user');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');

forgotPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail({
        to: user.email,
        subject: 'Password Reset',
        text: `Reset your password: ${resetURL}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
                <h2 style="color: #2e86de;">🔐 Reset Your Password</h2>
                <p style="font-size: 16px;">We received a request to reset your password for your <strong>Topic-Type</strong> account.</p>
                <p style="font-size: 16px;">Click the button below to reset your password:</p>
                <a href="${resetURL}" style="display: inline-block; background-color: #2e86de; color: white; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 6px;">Reset Password</a>
                <p style="font-size: 16px; margin-top: 20px;">This link is valid for <strong>10 minutes</strong>. If you didn’t request a password reset, you can ignore this email.</p>
                <hr style="margin: 30px 0;">
                <p style="font-size: 14px; color: #555;">— The <strong>Topic-Type</strong> Team 🚀</p>
            </div>
        `
    });


    res.status(200).json({ message: 'Reset link sent' });
};

resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
};
module.exports = { forgotPassword, resetPassword };