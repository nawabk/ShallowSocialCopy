const Twitt = require('../models/Twitt');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Notification = require('../models/Notification');
const myEmitter = require('../utils/MyEmitter');

exports.create = catchAsync(async (req, res, next) => {
  req.body.createdBy = req.user.id;
  req.body.createdOn = Date.now();
  let twitt = await Twitt.create(req.body);
  res.status(201).json({
    status: 'success',
    twitt
  });
});

exports.getOne = catchAsync(async (req, res, next) => {
  const twitt = await Twitt.findById(req.params.id)
    .populate({ path: 'createdBy', select: ['name'] })
    .populate({ path: 'comments.user', select: ['name'] });
  if (!twitt) {
    return next(new AppError('No such twitt found', 404));
  }
  res.json(twitt);
});

exports.getAll = catchAsync(async (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit * 1;
  const skip = (page - 1) * limit;
  const noOfDocs = await Twitt.countDocuments();
  const twittsQuery = Twitt.find()
    .sort({ createdOn: -1 })
    .populate({ path: 'createdBy', select: ['name'] })
    .populate({ path: 'comments.user', select: ['name'] });
  if (page && limit) {
    twittsQuery.skip(skip).limit(limit);
  }
  const twitts = await twittsQuery;
  res.json({
    status: 'success',
    noOfDocs,
    twitts
  });
});

exports.update = catchAsync(async (req, res, next) => {
  req.body.lastUpdated = Date.now();
  const updatedTwitt = await Twitt.findByIdAndUpdate(req.params.id, req.body);
  if (!updatedTwitt) {
    return next(new AppError('No such twitt found', 404));
  }
  res.status(201).json({
    status: 'success',
    updatedTwitt
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  const deletedTwitt = await Twitt.findByIdAndDelete(req.params.id);
  if (!deletedTwitt) {
    return next(new AppError('No such twitt found', 404));
  }
  res.json({
    status: 'success',
    deletedTwitt
  });
});

exports.likeTwitt = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const userName = req.user.name;
  const twitt = await Twitt.findOne({ _id: req.params.id });
  if (twitt.likes.includes(userId)) {
    await Twitt.updateOne({ _id: req.params.id }, { $pull: { likes: userId } });
    const notification = await Notification.findOne({
      postId: req.params.id,
      type: 'LIKE'
    }).populate({ path: 'notifiedBy', select: ['name'] });
    if (notification && notification.notifiedBy.length > 1) {
      let title = '';
      for (let i = 0; i < notification.notifiedBy.length; i++) {
        const elem = notification.notifiedBy[i];
        if (elem._id !== userId) {
          if (notification.notifiedBy.length == 2)
            title = `${elem.name} liked your post`;
          else
            title = `${elem.name} and ${notification.notifiedBy.length}+ others liked your post`;
          break;
        }
      }
      const updatedNotification = await Notification.findOneAndUpdate(
        { postId: req.params.id, type: 'LIKE' },
        { title: title, $pull: { notifiedBy: userId } },
        { new: true }
      );
      myEmitter.emit(
        'updateNotify',
        twitt.createdBy.toString(),
        updatedNotification
      );
    } else if (notification && notification.notifiedBy.length <= 1) {
      await Notification.deleteOne({ postId: req.params.id, type: 'LIKE' });
      myEmitter.emit(
        'deleteNotify',
        twitt.createdBy.toString(),
        notification._id
      );
    }
    return res.json({
      status: 'success',
      message: `Twitt is unliked by ${userName}`
    });
  }
  const updatedTwitt = await Twitt.updateOne(
    { _id: req.params.id },
    { $push: { likes: userId } }
  );
  if (twitt.createdBy.toString() !== userId) {
    const savedNotification = await Notification.findOne({
      postId: req.params.id,
      type: 'LIKE'
    });
    if (savedNotification) {
      const updatedNotification = await Notification.findOneAndUpdate(
        { postId: req.params.id, type: 'LIKE' },
        {
          title: `${req.user.name} and ${savedNotification.notifiedBy.length}+ others liked your post`,
          $push: { notifiedBy: userId },
          lastUpdatedOn: Date.now()
        },
        { new: true }
      );
      myEmitter.emit(
        'updateNotify',
        twitt.createdBy.toString(),
        updatedNotification
      );
    } else {
      const notification = {
        title: `${req.user.name} likes your post`,
        type: 'LIKE',
        notifyTo: twitt.createdBy,
        notifiedBy: [userId],
        postId: req.params.id,
        createdOn: Date.now()
      };
      const createdNotification = await Notification.create(notification);
      myEmitter.emit('notify', twitt.createdBy.toString(), createdNotification);
    }
  }
  if (updatedTwitt.nModified === 0) {
    return res.status(404).json({
      status: 'fail',
      message: 'Twitt does not found'
    });
  }
  res.status(201).json({
    status: 'success',
    message: `Twitt is liked by ${userName}`
  });
});

exports.commentTwitt = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const comment = {
    description: req.body.description,
    user: userId
  };
  const updatedTwitt = await Twitt.updateOne(
    { _id: req.params.id },
    { $push: { comments: comment } }
  );

  if (updatedTwitt.nModified === 0) {
    return next(new AppError('No such twitt found', 404));
  }
  const twitt = await Twitt.findById(req.params.id)
    .populate({ path: 'createdBy', select: ['name'] })
    .populate({ path: 'comments.user', select: ['name'] });

  if (twitt.createdBy._id.toString() !== userId) {
    const savedNotification = await Notification.findOne({
      postId: req.params.id,
      type: 'COMMENT'
    });
    if (savedNotification) {
      const updatedNotification = await Notification.findOneAndUpdate(
        { postId: req.params.id, type: 'COMMENT' },
        {
          title: `${req.user.name} and ${savedNotification.notifiedBy.length}+ others commented on your post`,
          $push: { notifiedBy: userId },
          lastUpdatedOn: Date.now()
        },
        {
          new: true
        }
      );
      myEmitter.emit(
        'updateNotify',
        twitt.createdBy._id.toString(),
        updatedNotification
      );
    } else {
      const notification = {
        title: `${req.user.name} commented on your post`,
        notifyTo: twitt.createdBy._id,
        notifiedBy: [userId],
        type: 'COMMENT',
        postId: req.params.id,
        createdOn: Date.now()
      };
      const createdNotification = await Notification.create(notification);
      myEmitter.emit(
        'notify',
        twitt.createdBy._id.toString(),
        createdNotification
      );
    }
  }

  res.status(201).json({
    status: 'success',
    twitt
  });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const twittId = req.params.id;
  const commentId = req.params.commentId;
  const twitt = await Twitt.findById(twittId);
  const comment = await twitt.comments.find(
    item => item._id.toString() === commentId
  );

  if (comment.user.toString() !== userId) {
    return next(
      new AppError(
        'Comments can updated or deleted by only the user who created it ',
        400
      )
    );
  }
  await Twitt.updateOne(
    {
      _id: twittId,
      'comments._id': commentId
    },
    {
      $set: {
        'comments.$.description': req.body.description
      }
    }
  );

  res.json({
    status: 'success'
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const twittId = req.params.id;
  const commentId = req.params.commentId;
  const twitt = await Twitt.findById(twittId);
  const comment = await twitt.comments.find(
    item => item._id.toString() === commentId
  );

  if (comment.user.toString() !== userId) {
    return next(
      new AppError(
        'Comments can updated or deleted by only the user who created it ',
        400
      )
    );
  }

  await Twitt.updateOne(
    { _id: twittId },
    {
      $pull: { comments: { _id: commentId } }
    }
  );
  const savedNotification = await Notification.findOne({
    postId: twittId,
    type: 'COMMENT'
  }).populate({ path: 'notifiedBy', select: ['name'] });
  if (savedNotification && savedNotification.notifiedBy.length > 1) {
    let title = '';
    for (let i = 0; i < savedNotification.notifiedBy.length; i++) {
      const elem = savedNotification.notifiedBy[i];
      if (elem._id !== userId) {
        if (savedNotification.notifiedBy.length == 2)
          title = `${elem.name} commented on your post`;
        else
          title = `${elem.name} and ${savedNotification.notifiedBy.length}+ others commented your post`;
        break;
      }
    }
    const updatedNotification = await Notification.findOneAndUpdate(
      { postId: twittId, type: 'COMMENT' },
      { title: title, $pull: { notifiedBy: userId } },
      { new: true }
    );
    myEmitter.emit(
      'updateNotify',
      twitt.createdBy.toString(),
      updatedNotification
    );
  } else if (savedNotification && savedNotification.notifiedBy.length <= 1) {
    await Notification.deleteOne({ postId: twittId, type: 'COMMENT' });
    myEmitter.emit(
      'deleteNotify',
      twitt.createdBy.toString(),
      savedNotification._id
    );
  }
  res.json({
    status: 'success'
  });
});
