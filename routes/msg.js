const express = require('express');
const { isAuthor } = require('../config/auth');
const { sendMsg, resMsg, getMsgUserDetail } = require('../controller/msg');
const router = express.Router();

router.route('/message/send').post(isAuthor, sendMsg);
router.route('/message/res/:to').get(isAuthor, resMsg);
router.route('/message/msguserdetail/:to').get(isAuthor, getMsgUserDetail);

module.exports = router;