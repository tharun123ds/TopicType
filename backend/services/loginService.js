const User = require('../models/user');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');

const loginUser = async ({ identifier, password }) => {
    if (!identifier || !password) {
        throw { status: 400, message: 'Identifier and password are required.' };
    }

    const query = validator.isEmail(identifier)
        ? { email: identifier }
        : { username: identifier };

    const user = await User.findOne(query);
    if (!user || !user.password) {
        throw { status: 401, message: 'Invalid credentials.' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw { status: 401, message: 'Invalid credentials.' };
    }

    const accessToken = generateAccessToken({ id: user._id });
    const refreshToken = generateRefreshToken({ id: user._id });

    return {
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
        },
        accessToken,
        refreshToken, // optional, you can set it in cookie in controller
    };
};

module.exports = loginUser;
