const User = require('../models/user');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const dns = require('dns').promises;
const sendEmail = require('../utils/sendEmail');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const withTimeout = require('../utils/withTimeout');

const isValidEmailDomain = async (email) => {
  const domain = email.split('@')[1];
  try {
    const records = await dns.resolveMx(domain);
    return records && records.length > 0;
  } catch {
    return false;
  }
};

const signupUser = async ({ username, email, password }) => {
  if (!username || !email || !password) {
    throw { status: 400, message: 'All fields are required.' };
  }

  if (!validator.isEmail(email)) {
    throw { status: 400, message: 'Invalid email format.' };
  }

  if (!(await isValidEmailDomain(email))) {
    throw { status: 400, message: 'Invalid email domain.' };
  }

  const validUsername = /^[a-zA-Z0-9]+$/;
  if (username.length < 3 || username.length > 20 || !validUsername.test(username)) {
    throw { status: 400, message: 'Username must be 3-20 alphanumeric characters.' };
  }

  if (password.length < 8) {
    throw { status: 400, message: 'Password must be at least 8 characters long.' };
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw { status: 409, message: 'Email or username already in use.' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  try {
    // Set a 5-second timeout for sending the email
    await withTimeout(
      sendEmail({
        to: email,
        subject: 'Welcome to Topic-Type! 🎉',
        text: `Hi ${username},\n\nYour Topic-Type account was created successfully.\n\nHappy typing!\n– Team Topic-Type`,
        html: `<p>Hi <strong>${username}</strong>,</p><p>Your Topic-Type account was created successfully.</p><p>Happy typing! 🚀</p><br/><p>– Team <strong>Topic-Type</strong></p>`,
      }),
      5000 // 5 seconds timeout
    );
  } catch (err) {
    // If the email sending fails or times out, delete the user
    await User.findByIdAndDelete(newUser._id);

    // Log the error with context
    console.error('Signup email failed:', {
      userId: newUser._id,
      email,
      error: err.message,
    });

    // Throw a meaningful error to frontend
    throw {
      status: 400,
      message: 'Failed to send welcome email. Please use a valid email address.',
    };
  }


  const payload = {
    id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    role: newUser.role,
  };


  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    user: {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    },
    accessToken,
    refreshToken,
  };
};

module.exports = signupUser;
