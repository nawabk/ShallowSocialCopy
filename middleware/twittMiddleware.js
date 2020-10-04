const Twitt = require('../models/Twitt');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.checkUpdateOrDelete = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const twitt = await Twitt.findById(req.params.id);
  const createdById = twitt.createdBy;
  if (userId.toString() !== createdById.toString()) {
    return next(
      new AppError(
        'Twitt can be updated or deleted by only the user who created it',
        400
      )
    );
  }
  next();
});
