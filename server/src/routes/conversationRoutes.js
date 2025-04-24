const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const convoCtl = require('../controllers/conversationController');

// Conversation
router.post('/conversations',           convoCtl.create);
router.get ('/conversations',           convoCtl.list);
router.delete('/conversations/:id',     convoCtl.remove);

module.exports = router;
