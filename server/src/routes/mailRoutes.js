const express = require('express');
const router  = express.Router();
const ctl     = require('../controllers/mailController');
const auth    = require('../middlewares/auth');

router.post('/activation',      auth, ctl.sendActivation);
router.post('/new-password',    auth, ctl.sendNewPassword);
router.post('/password-changed',auth, ctl.sendPasswordChanged);

module.exports = router;
