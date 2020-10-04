const express = require('express');
const authController = require('../controller/authController');
const userController = require('../controller/userController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.get(
  '/isTokenValid',
  authController.protect,
  authController.isTokenValid
);

router.patch('/follow/:userId', authController.protect, userController.follow);
router.patch(
  '/unfollow/:userId',
  authController.protect,
  userController.unfollow
);

router.get('/following/:userId', userController.getFollowing);
router.get('/followers/:userId', userController.getFollowers);

module.exports = router;
