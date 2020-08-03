const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const certiConrtoller = require('../controllers/certiController');

router.get('/certi');
router.get('/certi/:certiId');
router.post('/certi');


module.exports = router;