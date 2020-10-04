const express = require('express');
const authController = require('../controller/authController');
const notificationController = require('../controller/notificationController');
const router = express.Router();

router.use(authController.protect);

router.get('/', notificationController.getAll);
router.put('/markAllRead', notificationController.markAllRead);

module.exports = router;
