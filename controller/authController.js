const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const createToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
const createSendToken = (user, req, res) => {
  const token = createToken(user._id);
  user.password = undefined;
  res.status(201).json({
    status: 'success',
    token,
    user
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  createSendToken(newUser, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  const user = await User.findOne({ email }).populate('+password');

  if (!user) {
    return next(new AppError('Email does not exist', 401));
  }
  if (!(await user.comparePassword(password, user.password))) {
    return next(new AppError('Password does not match', 401));
  }
  createSendToken(user, req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('Your logged out..please login back to grant access', 401)
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'This user belonging to this token does not longer exist.',
        401
      )
    );
  }
  req.user = currentUser;
  next();
});

exports.isTokenValid = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'token is valid'
  });
};
