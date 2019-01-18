const express = require('express');
const router = express.Router();

var listTest = require('../lists/test')

router.get('/test', listTest.getFirst)

module.exports = router;