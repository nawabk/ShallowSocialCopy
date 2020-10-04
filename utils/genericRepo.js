const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');

exports.create = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.json({
      status: 'success',
      data: doc
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const query = await Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    res.json({
      status: 'success',
      data: doc
    });
  });
