const User = require('../models/user');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');

const signupUser = async ({ username, email, password }) => {
  if (!username || !email || !password) {
    throw { status: 400, message: 'All fields are required.' };
  }

  if (!validator.isEmail(email)) {
    throw { status: 400, message: 'Invalid email format.' };
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

  const accessToken = generateAccessToken({ id: newUser._id, email: newUser.email });
  const refreshToken = generateRefreshToken({ id: newUser._id });

  return {
    user: {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    },
    accessToken,
    refreshToken, // optional, you can set it in cookie in controller
  };
};

module.exports = signupUser;
