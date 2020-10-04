const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const twittSchema = new mongoose.Schema({
  description: {
    type: String
  },
  imageName: {
    type: String
  },
  imageData: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Created by is mandotary']
  },
  createdOn: {
    type: Date,
    required: [true, 'Created on is mandotary']
  },
  lastUpdated: {
    type: Date
  },
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ],
  comments: [
    {
      description: {
        type: String,
        required: [true, 'Please add some text for the comment']
      },
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    }
  ]
});

twittSchema.pre('save', function(next) {
  if (!this.description && !this.imageName && !this.imageData) {
    return next(new AppError('Please provide twitt content', 400));
  }
  next();
});

module.exports = mongoose.model('Twitt', twittSchema);
