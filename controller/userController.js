const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.follow = catchAsync(async (req, res, next) => {
  const follower = req.user;
  const followingId = req.params.userId;
  const { name } = await User.findOne(
    { _id: followingId },
    { _id: 0, name: 1 }
  );
  if (await User.findOne({ _id: follower.id, following: followingId })) {
    return next(new AppError('Already following', 400));
  }
  await User.findByIdAndUpdate(follower.id, {
    $push: { following: followingId }
  });
  await User.findByIdAndUpdate(followingId, {
    $push: { followers: follower.id }
  });
  res.json({
    status: 'success',
    message: `Successfully added to follow ${name}`
  });
});

exports.unfollow = catchAsync(async (req, res, next) => {
  const follower = req.user;
  const followingId = req.params.userId;
  const { name } = await User.findOne(
    { _id: followingId },
    { _id: 0, name: 1 }
  );

  await User.findByIdAndUpdate(follower.id, {
    $pull: { following: followingId }
  });
  await User.findByIdAndUpdate(followingId, {
    $pull: { followers: follower.id }
  });
  res.json({
    status: 'success',
    message: `Successfully unfollow ${name}`
  });
});

exports.getFollowing = catchAsync(async (req, res, next) => {
  const followingOfUser = await User.find(
    { _id: req.params.userId },
    { _id: 0, following: 1 }
  ).populate({ path: 'following', select: ['name', 'photo'] });
  res.json({
    status: 'success',
    data: followingOfUser
  });
});

exports.getFollowers = catchAsync(async (req, res, next) => {
  const followersOfUser = await User.find(
    { _id: req.params.userId },
    { _id: 0, followers: 1 }
  ).populate({ path: 'followers', select: ['photo', 'name'] });

  res.json({
    status: 'success',
    data: followersOfUser
  });
});
