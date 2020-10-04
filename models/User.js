const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name']
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide password']
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please provide password'],
    validate: {
      validator: function(el) {
        return el == this.password;
      },
      message: 'Password are not same'
    }
  },
  location: {
    type: String
  },
  following: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ],
  followers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ]
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.comparePassword = async (reqPassword, savedPassword) => {
  return await bcrypt.compare(reqPassword, savedPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
