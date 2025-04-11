const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');
const generateRandomPassword = require('../utils/generateRandomPassword');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        const googleId = profile.id;

        if (!email) return done(null, false, { message: 'No email returned from Google' });

        let user = await User.findOne({ email });

        if (user) {
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        } else {
            const generatedPassword = generateRandomPassword(12);
            const hashedPassword = await bcrypt.hash(generatedPassword, 10);

            user = await User.create({
                username: profile.displayName.replace(/\s+/g, '').toLowerCase(),
                email,
                googleId,
                password: hashedPassword,
                verified: true,
            });

            await sendEmail({
                to: email,
                subject: 'Welcome to Topic-Type! 🚀 Your Account Details',
                text: `Hi ${profile.displayName},\n\nYour account was created via Google OAuth.\nHere is your auto-generated password: ${generatedPassword}\n\nYou can log in anytime and change your password from your profile settings.\n\nEnjoy typing!\n– Team Topic-Type`,
                html: `
                    <p>Hi <strong>${profile.displayName}</strong>,</p>
                    <p>Your account has been created using Google OAuth.</p>
                    <p><strong>Your password:</strong> <code>${generatedPassword}</code></p>
                    <p>You can log in anytime and change this password from your profile settings.</p>
                    <p>Happy typing! 🚀</p>
                    <br/>
                    <p>– Team <strong>Topic-Type</strong></p>
                `,
            });
        }

        return done(null, user);

    } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, null);
    }
}));

module.exports = passport;
