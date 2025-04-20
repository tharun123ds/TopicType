const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');
const generateRandomPassword = require('../utils/generateRandomPassword');
const withTimeout = require('../utils/withTimeout');

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
            // Link Google ID if not already linked
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        } else {

            // Generate a secure random password and hash it
            const generatedPassword = generateRandomPassword(12);
            const hashedPassword = await bcrypt.hash(generatedPassword, 10);

            // Generate a username based on the Google display name
            let username = profile.displayName.replace(/\s+/g, '').toLowerCase();

            // Check if the username already exists
            let existingUser = await User.findOne({ username });

            // If the username is already taken, add a suffix to make it unique
            let suffix = 1;
            while (existingUser) {
                username = `${profile.displayName.replace(/\s+/g, '').toLowerCase()}${suffix}`;
                existingUser = await User.findOne({ username });
                suffix++;
            }

            // Create the new user
            user = await User.create({
                username,
                email,
                googleId,
                password: hashedPassword,
                verified: true,
            });

            // Use withTimeout to wrap the email sending logic with a timeout
            try {
                await withTimeout(
                    sendEmail({
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
                    }),
                    5000 // 5 seconds timeout
                );
            } catch (emailError) {
                console.error('Signup email failed:', emailError);
                // Rollback user creation in case of email failure
                await User.findByIdAndDelete(user._id);
                return done(emailError, null);
            }
        }

        return done(null, user);

    } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, null);
    }
}));

module.exports = passport;
