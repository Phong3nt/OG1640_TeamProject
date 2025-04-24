const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const isParticipant = require('../middlewares/isParticipant');
const msgCtl   = require('../controllers/messageController');

// Message
router.post('/messages',                msgCtl.send);
router.get ('/messages/:conversationId',  isParticipant, msgCtl.fetch);
router.patch('/messages/:conversationId/read',  isParticipant, msgCtl.markRead);

module.exports = router;
