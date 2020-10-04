const express = require('express');
const twittController = require('../controller/twittController');
const authController = require('../controller/authController');
const twittMiddleware = require('../middleware/twittMiddleware');

const router = express.Router();

router.use(authController.protect);
router
  .route('/')
  .post(twittController.create)
  .get(twittController.getAll);

router.get('/:id', twittController.getOne);
router
  .route('/:id')
  .patch(twittController.update)
  .delete(twittController.delete);

router.patch('/:id/like', twittController.likeTwitt);
router.patch('/:id/comment', twittController.commentTwitt);
router.patch('/:id/comment/:commentId', twittController.updateComment);
router.delete('/:id/comment/:commentId', twittController.deleteComment);

module.exports = router;
