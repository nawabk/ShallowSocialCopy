const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  notifyTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  notifiedBy: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ],
  type: {
    type: String,
    enum: ['LIKE', 'COMMENT']
  },
  postId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Twitt'
  },
  createdOn: {
    type: Date
  },
  lastUpdatedOn: {
    type: Date
  },
  isRead: {
    type: Boolean,
    default: false
  }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
