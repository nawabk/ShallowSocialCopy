const Notification = require('../models/Notification');
const catchAsync = require('../utils/catchAsync');

exports.getAll = catchAsync(async (req, res, next) => {
  const limit = req.query.limit * 1;
  const page = req.query.page * 1;
  const skip = (page - 1) * limit;
  const notificationQuery = Notification.find({
    notifyTo: req.user.id
  }).sort({ lastUpdateOn: -1, createdOn: -1 });
  if (limit && skip) {
    notificationQuery.skip(skip).limit(limit);
  }
  const notifications = await notificationQuery;
  res.json(notifications);
});

exports.markAllRead = catchAsync(async (req, res, next) => {
  await Notification.updateMany(
    { notifyTo: req.user.id },
    { $set: { isRead: true } }
  );
  res.json({
    status: 'success',
    message: 'All notification marked as read'
  });
});
