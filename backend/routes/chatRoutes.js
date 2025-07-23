const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/multi', protect, chatController.multiModeChat);
router.post('/single', protect, chatController.singleModeChat);
router.get('/history', protect, chatController.getHistory);

module.exports = router;