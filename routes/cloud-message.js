const express = require('express');
const { isAuthor } = require('../config/auth');
const { setNotiToken } = require('../controller/cloud-message');
const router = express.Router();

router.route('/setnotitoken').post(isAuthor, setNotiToken);

module.exports = router;
