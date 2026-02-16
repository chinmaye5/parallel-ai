const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/multi', protect, chatController.multiModeChat);
router.post('/single', protect, chatController.singleModeChat);
router.post('/consensus', protect, chatController.consensusChat);
router.get('/history', protect, chatController.getHistory);
router.delete('/:chatId', protect, chatController.deleteChat);

module.exports = router;
